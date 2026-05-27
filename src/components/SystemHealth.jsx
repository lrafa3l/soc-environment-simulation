/**
 * SystemHealth — SOC system status board and EPS sparkline.
 *
 * @param {{ systems: Array<{key, name, status}>, epsHistory: number[] }} props
 */
export default function SystemHealth({ systems, epsHistory }) {
  const STATUS_DOT = { ok: "dot-ok", warn: "dot-warn", error: "dot-error" };
  const STATUS_LABEL = { ok: "Operational", warn: "Degraded", error: "Error" };

  const maxEps = Math.max(...epsHistory, 1);

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="panel-title">
          <i className="ti ti-server" aria-hidden="true" /> System health
        </span>
      </div>

      <div className="health-rows">
        {systems.map((sys) => (
          <div key={sys.key} className="health-row">
            <div className="health-left">
              <span className={`status-dot ${STATUS_DOT[sys.status]}`} aria-hidden="true" />
              <span className="health-name">{sys.name}</span>
            </div>
            <span className={`health-status status-${sys.status}`}>
              {STATUS_LABEL[sys.status]}
            </span>
          </div>
        ))}
      </div>

      <div className="panel-head" style={{ borderTop: "0.5px solid var(--color-border-tertiary)", marginTop: 4 }}>
        <span className="panel-title">EPS history (30s)</span>
        <span className="muted-label">{epsHistory[epsHistory.length - 1] ?? 0} eps now</span>
      </div>

      <div className="sparkbar-wrap">
        <div className="sparkbar" aria-label="Events per second history chart" role="img">
          {epsHistory.map((v, i) => {
            const pct = Math.round((v / maxEps) * 100);
            const height = Math.max(3, pct * 0.52);
            const isLast = i === epsHistory.length - 1;
            return (
              <div
                key={i}
                className={`spark-bar ${isLast ? "spark-bar-current" : ""}`}
                style={{ height }}
                title={`${v} eps`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
