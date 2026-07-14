export interface OutlookEvent {
  id?: string;
  subject: string;
  body?: {
    contentType: "text" | "html";
    content: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  webLink?: string;
}

// In-memory token cache (synchronized with localStorage for durability)
let cachedAccessToken: string | null = null;
let cachedRefreshToken: string | null = null;
let cachedExpiryTime: number | null = null;

// Initialize tokens from localStorage on module load
const initTokensFromStorage = () => {
  try {
    cachedAccessToken = localStorage.getItem("outlook_access_token");
    cachedRefreshToken = localStorage.getItem("outlook_refresh_token");
    const expiry = localStorage.getItem("outlook_token_expiry");
    cachedExpiryTime = expiry ? parseInt(expiry, 10) : null;
  } catch (e) {
    console.error("Failed to load Outlook tokens from storage", e);
  }
};

initTokensFromStorage();

export const isOutlookConnected = (): boolean => {
  return !!cachedAccessToken;
};

export const getOutlookAccessToken = async (): Promise<string | null> => {
  if (!cachedAccessToken) return null;

  // Check if token is expired or close to expiring (within 2 minutes)
  if (cachedExpiryTime && Date.now() + 120 * 1000 >= cachedExpiryTime) {
    if (cachedRefreshToken) {
      try {
        console.log("Outlook access token expired, refreshing...");
        const refreshed = await refreshOutlookAccessToken(cachedRefreshToken);
        if (refreshed) {
          return refreshed.accessToken;
        }
      } catch (err) {
        console.error("Failed to refresh Outlook access token:", err);
        // Clear expired tokens if refresh fails
        logoutOutlook();
        return null;
      }
    } else {
      logoutOutlook();
      return null;
    }
  }

  return cachedAccessToken;
};

// Initiate sign-in popup
export const loginOutlook = async (origin: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const url = `/api/auth/outlook/url?origin=${encodeURIComponent(origin)}`;
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const authWindow = window.open(
        url,
        "outlook_oauth_popup",
        `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes`
      );

      if (!authWindow) {
        reject(new Error("Le bloqueur de fenêtres contextuelles est actif. Veuillez autoriser les popups pour ce site."));
        return;
      }

      const messageListener = (event: MessageEvent) => {
        // Validate origin
        const eventOrigin = event.origin;
        if (!eventOrigin.endsWith(".run.app") && !eventOrigin.includes("localhost")) {
          return;
        }

        if (event.data?.type === "OUTLOOK_AUTH_SUCCESS") {
          const { accessToken, refreshToken, expiresIn } = event.data;
          
          cachedAccessToken = accessToken;
          cachedRefreshToken = refreshToken || null;
          cachedExpiryTime = Date.now() + expiresIn * 1000;

          // Save to localStorage
          localStorage.setItem("outlook_access_token", accessToken);
          if (refreshToken) {
            localStorage.setItem("outlook_refresh_token", refreshToken);
          }
          localStorage.setItem("outlook_token_expiry", cachedExpiryTime.toString());

          window.removeEventListener("message", messageListener);
          resolve(true);
        } else if (event.data?.type === "OUTLOOK_AUTH_FAILURE") {
          window.removeEventListener("message", messageListener);
          reject(new Error(event.data.error || "L'authentification Outlook a échoué."));
        }
      };

      window.addEventListener("message", messageListener);
    } catch (err) {
      reject(err);
    }
  });
};

// Refresh outlook access token
export const refreshOutlookAccessToken = async (refreshToken: string): Promise<{ accessToken: string; expiresIn: number } | null> => {
  try {
    const response = await fetch("/api/auth/outlook/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.accessToken) {
      throw new Error("Invalid response from refresh token endpoint");
    }

    cachedAccessToken = data.accessToken;
    if (data.refreshToken) {
      cachedRefreshToken = data.refreshToken;
      localStorage.setItem("outlook_refresh_token", data.refreshToken);
    }
    cachedExpiryTime = Date.now() + data.expiresIn * 1000;

    localStorage.setItem("outlook_access_token", data.accessToken);
    localStorage.setItem("outlook_token_expiry", cachedExpiryTime.toString());

    return { accessToken: data.accessToken, expiresIn: data.expiresIn };
  } catch (error) {
    console.error("Error refreshing Outlook token:", error);
    logoutOutlook();
    return null;
  }
};

// Logout
export const logoutOutlook = () => {
  cachedAccessToken = null;
  cachedRefreshToken = null;
  cachedExpiryTime = null;
  localStorage.removeItem("outlook_access_token");
  localStorage.removeItem("outlook_refresh_token");
  localStorage.removeItem("outlook_token_expiry");
};

// --- MICROSOFT GRAPH API CALLS ---

export const fetchOutlookEvents = async (
  accessToken: string,
  timeMin?: string,
  timeMax?: string
): Promise<OutlookEvent[]> => {
  let url = "https://graph.microsoft.com/v1.0/me/calendar/events?$top=100&$select=id,subject,body,start,end,webLink";
  
  // Outlook / Microsoft Graph uses OData filter for range queries
  const filters: string[] = [];
  if (timeMin) {
    filters.push(`start/dateTime ge '${timeMin}'`);
  }
  if (timeMax) {
    filters.push(`end/dateTime le '${timeMax}'`);
  }
  if (filters.length > 0) {
    url += `&$filter=${encodeURIComponent(filters.join(" and "))}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Prefer": 'outlook.timezone="UTC"'
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Outlook Calendar Fetch Failed: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.value || [];
};

export const createOutlookEvent = async (
  accessToken: string,
  event: OutlookEvent
): Promise<OutlookEvent> => {
  const response = await fetch("https://graph.microsoft.com/v1.0/me/calendar/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Prefer": 'outlook.timezone="UTC"'
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Outlook Calendar Event Creation Failed: ${response.status} - ${errText}`);
  }

  return await response.json();
};

export const updateOutlookEvent = async (
  accessToken: string,
  eventId: string,
  event: Partial<OutlookEvent>
): Promise<OutlookEvent> => {
  const response = await fetch(`https://graph.microsoft.com/v1.0/me/calendar/events/${eventId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Prefer": 'outlook.timezone="UTC"'
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Outlook Calendar Event Update Failed: ${response.status} - ${errText}`);
  }

  return await response.json();
};

export const deleteOutlookEvent = async (accessToken: string, eventId: string): Promise<void> => {
  const response = await fetch(`https://graph.microsoft.com/v1.0/me/calendar/events/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Outlook Calendar Event Deletion Failed: ${response.status} - ${errText}`);
  }
};
