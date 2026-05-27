/**
 * Header — top bar with SOC title, live indicator, and stream controls.
 *
 * @param {{ paused: boolean, onTogglePause: () => void }} props
 */
export default function Header({ paused, onTogglePause }) {
  return (
    <header className="soc-header">
      <div className="soc-title">
        <span className={`status-pulse ${paused ? "paused" : ""}`} aria-hidden="true" />
        <span>SOC Environment Simulation</span>
        <span className="live-badge">{paused ? "PAUSED" : "LIVE"}</span>
      </div>

      <div className="header-controls">
        <button
          className={`btn btn-sm ${paused ? "btn-success" : "btn-outline"}`}
          onClick={onTogglePause}
          aria-label={paused ? "Resume log stream" : "Pause log stream"}
        >
          <i className={`ti ${paused ? "ti-player-play" : "ti-player-pause"}`} aria-hidden="true" />
          {paused ? " Resume" : " Pause"}
        </button>
      </div>
    </header>
  );
}
