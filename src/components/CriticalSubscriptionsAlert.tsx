import React from "react";
import { Abonnement } from "../types";

interface CriticalSubscriptionsAlertProps {
  abonnements: Abonnement[];
  onNavigateToModule: (moduleId: string) => void;
}

export default function CriticalSubscriptionsAlert({
  abonnements,
  onNavigateToModule
}: CriticalSubscriptionsAlertProps) {
  return null;
}
