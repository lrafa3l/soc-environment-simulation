import { useEffect, useRef } from "react";
import { formatTimestamp, SEVERITY_CLASSES } from "../utils/severity";

/**
 * LogFeed — scrollable live log stream panel.
 *
 * Auto-scrolls to the latest entry unless the user has scrolled up.
 *
 * @param {{ logs: object[], onClear: () => void }} props
 */
export default function LogFeed({ logs, onClear }) {
  const feedRef = useRef(null);
  const userScrolledRef = useRef(false);

  /* Auto-scroll, but only if the user hasn't scrolled up */
  useEffect(() => {
    const el = feedRef.current;
    if (!el || userScrolledRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [logs]);

  function handleScroll() {
    const el = feedRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    userScrolledRef.current = !atBottom;
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <span className="panel-title">
          <i className="ti ti-terminal" aria-hidden="true" /> Live log stream
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="muted-label">{logs.length} lines</span>
          <button className="btn btn-xs btn-outline" onClick={onClear} aria-label="Clear log feed">
            <i className="ti ti-trash" aria-hidden="true" /> Clear
          </button>
        </div>
      </div>

      <div
        className="log-feed"
        ref={feedRef}
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label="Live security event log"
      >
        {logs.map((entry) => (
          <div key={entry.id} className="log-line">
            <span className="log-ts">{formatTimestamp(entry.ts)}</span>
            <span className={`log-sev sev-${entry.severity}`}>[{entry.severity}]</span>
            <span className="log-msg">{entry.message}</span>
            <span className="log-source">{entry.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
