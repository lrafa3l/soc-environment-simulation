import { useState, useEffect, useRef, useCallback } from "react";
import { generateLogEntry } from "../data/events";

/** Maximum number of log lines kept in memory */
const MAX_LOG_LINES = 200;

/** Interval range for event emission (ms) */
const EMIT_MIN_MS = 200;
const EMIT_MAX_MS = 900;

/** How many EPS history buckets to track (each bucket = 1 second) */
const EPS_HISTORY_SIZE = 30;

/**
 * useLogEngine — drives the synthetic log stream.
 *
 * Emits a new log entry at a random interval between EMIT_MIN_MS and
 * EMIT_MAX_MS, respecting the `paused` flag. Maintains a rolling EPS
 * (events-per-second) history for sparkline rendering.
 *
 * @param {boolean} paused — when true the stream is halted
 * @returns {{ logs, clearLogs, totalEvents, epsHistory }}
 */
export function useLogEngine(paused) {
  const [logs, setLogs] = useState([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [epsHistory, setEpsHistory] = useState(new Array(EPS_HISTORY_SIZE).fill(0));

  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const tickCountRef = useRef(0); // events emitted in the current 1s bucket

  /* 1-second EPS bucket ticker */
  useEffect(() => {
    const id = setInterval(() => {
      const count = tickCountRef.current;
      tickCountRef.current = 0;
      setEpsHistory((prev) => [...prev.slice(1), count]);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  /* Recursive setTimeout log emitter */
  useEffect(() => {
    let timerId;

    function emit() {
      if (!pausedRef.current) {
        const entry = generateLogEntry();
        setLogs((prev) => {
          const next = [...prev, entry];
          return next.length > MAX_LOG_LINES ? next.slice(-MAX_LOG_LINES) : next;
        });
        setTotalEvents((n) => n + 1);
        tickCountRef.current += 1;
      }
      const delay = EMIT_MIN_MS + Math.random() * (EMIT_MAX_MS - EMIT_MIN_MS);
      timerId = setTimeout(emit, delay);
    }

    timerId = setTimeout(emit, EMIT_MIN_MS);
    return () => clearTimeout(timerId);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, clearLogs, totalEvents, epsHistory };
}
