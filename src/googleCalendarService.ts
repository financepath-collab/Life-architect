import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();
// Add required Google Calendar scopes
provider.addScope("https://www.googleapis.com/auth/calendar");
provider.addScope("https://www.googleapis.com/auth/calendar.events");

// In-memory token cache
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token not cached yet (e.g. page refreshed)
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Interactive sign-in with Google
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Impossible d'obtenir le jeton d'accès Google.");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Get current cached token
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Set token manually (useful for callback syncs)
export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

// Sign out
export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// --- GOOGLE CALENDAR API CALLS ---

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    date?: string; // YYYY-MM-DD for all-day
    dateTime?: string; // ISO string
    timeZone?: string;
  };
  end: {
    date?: string;
    dateTime?: string;
    timeZone?: string;
  };
  htmlLink?: string;
}

// Fetch events from the primary calendar
export const fetchGoogleEvents = async (
  accessToken: string,
  timeMin?: string,
  timeMax?: string
): Promise<GoogleCalendarEvent[]> => {
  let url = "https://www.googleapis.com/calendar/v3/calendars/primary/events?singleEvents=true&orderBy=startTime&maxResults=250";
  if (timeMin) {
    url += `&timeMin=${encodeURIComponent(timeMin)}`;
  }
  if (timeMax) {
    url += `&timeMax=${encodeURIComponent(timeMax)}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Calendar Fetch Failed: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  return data.items || [];
};

// Create an event in the primary calendar
export const createGoogleEvent = async (
  accessToken: string,
  event: GoogleCalendarEvent
): Promise<GoogleCalendarEvent> => {
  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Calendar Event Creation Failed: ${response.status} - ${errText}`);
  }

  return await response.json();
};

// Update an existing event
export const updateGoogleEvent = async (
  accessToken: string,
  eventId: string,
  event: Partial<GoogleCalendarEvent>
): Promise<GoogleCalendarEvent> => {
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Calendar Event Update Failed: ${response.status} - ${errText}`);
  }

  return await response.json();
};

// Delete an event
export const deleteGoogleEvent = async (accessToken: string, eventId: string): Promise<void> => {
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Google Calendar Event Deletion Failed: ${response.status} - ${errText}`);
  }
};
