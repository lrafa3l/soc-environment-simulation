import { useState, useCallback } from "react";

/** Maximum number of alerts kept in the queue */
const MAX_ALERTS = 30;

/**
 * useAlerts — manages the active alert queue and incident lifecycle.
 *
 * Alerts are derived from high-severity log entries injected by the
 * parent component. Each alert tracks its status (open → resolved or
 * escalated) and creation timestamp for MTTD calculations.
 *
 * @returns {{ alerts, addAlert, resolveAlert, escalateAlert, mttdAvg }}
 */
export function useAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [mttdSamples, setMttdSamples] = useState([]);

  /**
   * Adds a new alert derived from a log entry.
   * @param {{ id, ts, severity, message, source, host, user }} logEntry
   */
  const addAlert = useCallback((logEntry) => {
    setAlerts((prev) => {
      const alert = {
        ...logEntry,
        alertId: `INC-${logEntry.id.slice(-6).toUpperCase()}`,
        status: "open",
        createdAt: Date.now(),
      };
      const next = [alert, ...prev];
      return next.length > MAX_ALERTS ? next.slice(0, MAX_ALERTS) : next;
    });
  }, []);

  /**
   * Resolves an open alert by ID and records MTTD.
   * @param {string} id
   */
  const resolveAlert = useCallback((id) => {
    setAlerts((prev) => {
      const alert = prev.find((a) => a.id === id);
      if (alert) {
        const mttd = Math.round((Date.now() - alert.createdAt) / 1000);
        setMttdSamples((s) => [...s, mttd]);
      }
      return prev.filter((a) => a.id !== id);
    });
  }, []);

  /**
   * Escalates an alert to CRIT severity and marks it as escalated.
   * @param {string} id
   */
  const escalateAlert = useCallback((id) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, severity: "CRIT", status: "escalated" } : a
      )
    );
  }, []);

  const mttdAvg =
    mttdSamples.length > 0
      ? Math.round(mttdSamples.reduce((a, b) => a + b, 0) / mttdSamples.length)
      : null;

  return { alerts, addAlert, resolveAlert, escalateAlert, mttdAvg };
}
