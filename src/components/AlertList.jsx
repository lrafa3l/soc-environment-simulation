import { formatTimestamp, SEVERITY_ICONS, SEVERITY_ORDER } from "../utils/severity";

/**
 * AlertList — sorted, scrollable list of active threat alerts.
 *
 * Alerts are sorted by severity (CRIT first) then by creation time.
 * Clicking a row opens it in the IncidentPanel.
 *
 * @param {{ alerts: object[], selected: object|null, onSelect: (alert: object) => void }} props
 */
export default function AlertList({ alerts, selected, onSelect }) {
  const sorted = [...alerts].sort((a, b) => {
    const sevDiff = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    return sevDiff !== 0 ? sevDiff : b.createdAt - a.createdAt;
  });

  const openCount = alerts.filter((a) => a.status === "open").length;

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="panel-title">
          <i className="ti ti-bell" aria-hidden="true" /> Threat alerts
        </span>
        <span className="badge badge-info">{openCount} open</span>
      </div>

      <div className="alert-list" role="list" aria-label="Active threat alerts">
        {sorted.length === 0 && (
          <p className="empty-state">No active alerts — system nominal.</p>
        )}
        {sorted.map((alert) => (
          <div
            key={alert.id}
            role="listitem"
            className={`alert-row ${selected?.id === alert.id ? "selected" : ""}`}
            onClick={() => onSelect(alert)}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelect(alert)}
            aria-selected={selected?.id === alert.id}
          >
            <i
              className={`ti ${SEVERITY_ICONS[alert.severity]} alert-icon sev-${alert.severity}`}
              aria-hidden="true"
            />
            <div className="alert-body">
              <div className="alert-name">{alert.message}</div>
              <div className="alert-meta">
                {alert.host} · {alert.source}
                {alert.status === "escalated" && (
                  <span className="escalated-tag"> · ESCALATED</span>
                )}
              </div>
            </div>
            <span className={`badge badge-${alert.severity.toLowerCase()}`}>
              {alert.severity}
            </span>
            <span className="alert-ts">{formatTimestamp(alert.ts)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
