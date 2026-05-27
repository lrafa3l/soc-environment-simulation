/**
 * events.js — Simulated log event catalogue and generator utilities.
 *
 * All synthetic log messages are grouped by SIEM severity level.
 * Severity weights are tuned to produce a realistic distribution:
 * CRIT ~3%, HIGH ~7%, MED ~12%, LOW ~13%, INFO ~65%.
 */

/** @type {Record<string, [string, string][]>} severity → [message, source] pairs */
export const EVENT_CATALOGUE = {
  CRIT: [
    ["Ransomware signature detected on host", "endpoint"],
    ["Lateral movement — SMB brute force in progress", "ids"],
    ["Data exfiltration attempt (>500 MB outbound)", "proxy"],
    ["Privilege escalation via CVE-2024-1234", "endpoint"],
    ["C2 beacon to known malicious IP", "firewall"],
    ["Mimikatz process detected in memory", "endpoint"],
    ["Golden Ticket attack pattern identified", "ids"],
  ],
  HIGH: [
    ["Failed login threshold exceeded (50+ attempts)", "auth"],
    ["SQL injection payload detected in POST body", "waf"],
    ["Suspicious PowerShell encoded command executed", "endpoint"],
    ["DNS tunnelling pattern detected", "dns"],
    ["Tor exit node connection attempt blocked", "firewall"],
    ["Pass-the-Hash attack detected", "ids"],
    ["Anomalous data access by service account", "auth"],
  ],
  MED: [
    ["Port scan from internal host", "ids"],
    ["Unusual outbound traffic on port 4444", "firewall"],
    ["Service account used interactively", "auth"],
    ["Cleartext credentials found in HTTP request", "waf"],
    ["Beaconing to newly registered external domain", "dns"],
    ["Script execution policy bypass detected", "endpoint"],
    ["LDAP reconnaissance activity observed", "ids"],
  ],
  LOW: [
    ["SSH key rotation overdue (>90 days)", "auth"],
    ["Expired TLS certificate on internal service", "endpoint"],
    ["Default credentials attempt blocked", "auth"],
    ["Unencrypted FTP session initiated", "proxy"],
    ["Outdated software version detected on host", "endpoint"],
  ],
  INFO: [
    ["User login successful", "auth"],
    ["VPN session established", "vpn"],
    ["DNS query resolved successfully", "dns"],
    ["HTTP 200 response served", "proxy"],
    ["Firewall rule matched — traffic allowed", "firewall"],
    ["Scheduled task executed successfully", "endpoint"],
    ["Configuration backup completed", "endpoint"],
    ["Software update applied", "endpoint"],
    ["User password changed", "auth"],
    ["New device registered to user account", "auth"],
  ],
};

/** Simulated hostnames in the environment */
export const HOSTS = [
  "ws-0014", "ws-0022", "srv-db01", "srv-web02",
  "dc01", "lb-01", "ws-0031", "srv-app03",
];

/** Simulated usernames */
export const USERS = [
  "jsmith", "alee", "mgarcia", "root",
  "svc_backup", "admin", "rbrown",
];

/** All possible severity levels in descending order */
export const SEVERITY_LEVELS = ["CRIT", "HIGH", "MED", "LOW", "INFO"];

/**
 * Picks a severity level using a weighted random distribution.
 * @returns {"CRIT"|"HIGH"|"MED"|"LOW"|"INFO"}
 */
export function pickSeverity() {
  const r = Math.random();
  if (r < 0.03) return "CRIT";
  if (r < 0.10) return "HIGH";
  if (r < 0.22) return "MED";
  if (r < 0.35) return "LOW";
  return "INFO";
}

/**
 * Picks a random element from an array.
 * @template T
 * @param {T[]} arr
 * @returns {T}
 */
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generates a single synthetic log entry.
 * @returns {{ id: string, ts: Date, severity: string, message: string, source: string, host: string, user: string }}
 */
export function generateLogEntry() {
  const severity = pickSeverity();
  const [message, source] = pick(EVENT_CATALOGUE[severity]);
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: new Date(),
    severity,
    message,
    source,
    host: pick(HOSTS),
    user: pick(USERS),
  };
}
