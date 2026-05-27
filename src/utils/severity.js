/**
 * utils/severity.js — helpers for severity level display.
 */

/** CSS class map for severity badge colours */
export const SEVERITY_CLASSES = {
  CRIT: "badge-crit",
  HIGH: "badge-high",
  MED:  "badge-med",
  LOW:  "badge-low",
  INFO: "badge-info",
};

/** Tabler icon map for severity levels */
export const SEVERITY_ICONS = {
  CRIT: "ti-flame",
  HIGH: "ti-alert-triangle",
  MED:  "ti-alert-circle",
  LOW:  "ti-info-circle",
  INFO: "ti-circle",
};

/** Human-readable label map */
export const SEVERITY_LABELS = {
  CRIT: "Critical",
  HIGH: "High",
  MED:  "Medium",
  LOW:  "Low",
  INFO: "Info",
};

/** Sort order (lower = higher priority) */
export const SEVERITY_ORDER = { CRIT: 0, HIGH: 1, MED: 2, LOW: 3, INFO: 4 };

/**
 * Formats a Date object as HH:MM:SS.
 * @param {Date} date
 * @returns {string}
 */
export function formatTimestamp(date) {
  return date.toTimeString().slice(0, 8);
}

/**
 * Returns elapsed seconds since a unix timestamp.
 * @param {number} createdAt — Date.now() value
 * @returns {number}
 */
export function elapsedSeconds(createdAt) {
  return Math.round((Date.now() - createdAt) / 1000);
}
