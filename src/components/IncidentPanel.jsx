import { useState, useEffect } from "react";
import { elapsedSeconds, formatTimestamp } from "../utils/severity";

/**
 * IncidentPanel — detailed incident responder for a selected alert.
 *
 * Displays all incident metadata, a live "open for X seconds" counter,
 * and action buttons: Resolve, Escalate, and Copy Report (clipboard).
 *
 * @param {{ alert: object|null, onResolve: () => void, onEscalate: () => void }} props
 */
export default function IncidentPanel({ alert, onResolve, onEscalate }) {
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);

  /* Live elapsed counter */
  useEffect(() => {
    if (!alert) return;
    setElapsed(elapsedSeconds(alert.createdAt));
    const id = setInterval(() => setElapsed(elapsedSeconds(alert.createdAt)), 1000);
    return () => clearInterval(id);
  }, [alert]);

  function copyReport() {
    if (!alert) return;
    const report = [
      `INCIDENT REPORT`,
      `===============`,
      `Alert ID  : ${alert.alertId}`,
      `Severity  : ${alert.severity}`,
      `Status    : ${alert.status}`,
      `Description: ${alert.message}`,
      `Source    : ${alert.source}`,
      `Host      : ${alert.host}`,
      `User      : ${alert.user}`,
      `Detected  : ${formatTimestamp(alert.ts)}`,
      `Open for  : ${elapsed}s`,
    ].join("\n");
    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!alert) {
    return (
      <div className="panel">
        <div className="panel-head">
          <span className="panel-title">
            <i className="ti ti-shield" aria-hidden="true" /> Incident responder
          </span>
        </div>
        <div className="empty-state" style={{ padding: "1rem 1.25rem" }}>
          Select an alert to open an incident.
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="panel-title">
          <i className="ti ti-shield" aria-hidden="true" /> Incident responder
        </span>
        <span className={`badge badge-${alert.severity.toLowerCase()}`}>
          {alert.severity}
        </span>
      </div>

      <div className="incident-fields">
        <Field label="Alert ID"    value={alert.alertId} />
        <Field label="Description" value={alert.message} />
        <Field label="Source"      value={alert.source} />
        <Field label="Host"        value={alert.host} />
        <Field label="User"        value={alert.user} />
        <Field label="Detected"    value={formatTimestamp(alert.ts)} />
        <Field label="Open for"    value={`${elapsed}s`} highlight />
        <Field label="Status"      value={alert.status} />
      </div>

      <div className="incident-actions">
        <button className="btn btn-success" onClick={onResolve}>
          <i className="ti ti-check" aria-hidden="true" /> Resolve
        </button>
        <button className="btn btn-danger" onClick={onEscalate}>
          <i className="ti ti-arrow-up" aria-hidden="true" /> Escalate
        </button>
        <button className="btn btn-outline" onClick={copyReport}>
          <i className={`ti ${copied ? "ti-check" : "ti-copy"}`} aria-hidden="true" />
          {copied ? " Copied!" : " Copy report"}
        </button>
      </div>
    </div>
  );
}

/** Small key-value row inside the incident details */
function Field({ label, value, highlight }) {
  return (
    <div className="inc-field">
      <span className="inc-key">{label}</span>
      <span className={`inc-val ${highlight ? "inc-val-highlight" : ""}`}>{value}</span>
    </div>
  );
}
