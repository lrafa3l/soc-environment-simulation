/**
 * StatCards — row of top-level KPI metric cards.
 *
 * @param {{ totalEvents: number, openAlerts: number, critCount: number, epsHistory: number[] }} props
 */
export default function StatCards({ totalEvents, openAlerts, critCount, epsHistory }) {
  const currentEps = epsHistory[epsHistory.length - 1] ?? 0;
  const peakEps = Math.max(...epsHistory);

  return (
    <div className="stat-cards">
      <div className="stat-card">
        <div className="stat-label">Total events</div>
        <div className="stat-value">{totalEvents.toLocaleString()}</div>
        <div className="stat-sub">since session start</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Events / sec</div>
        <div className="stat-value">{currentEps}</div>
        <div className="stat-sub">peak {peakEps} eps</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Open alerts</div>
        <div className="stat-value">{openAlerts}</div>
        <div className="stat-sub">{critCount} critical</div>
      </div>

      <div className="stat-card">
        <div className="stat-label">Alert rate</div>
        <div className="stat-value">
          {totalEvents > 0 ? ((openAlerts / totalEvents) * 100).toFixed(1) : "0.0"}%
        </div>
        <div className="stat-sub">alerts / events</div>
      </div>
    </div>
  );
}
