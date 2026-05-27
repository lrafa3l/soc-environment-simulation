import { useState, useEffect } from "react";

/** How often system health states are re-evaluated (ms) */
const HEALTH_TICK_MS = 7000;

/** Probability thresholds for degraded / error states */
const P_ERROR = 0.03;
const P_WARN = 0.10;

/** Systems monitored in the SOC environment */
const SYSTEM_DEFINITIONS = [
  { key: "siem",    name: "SIEM Ingestor" },
  { key: "ti",      name: "Threat Intel Feed" },
  { key: "fw",      name: "Firewall (FW-01)" },
  { key: "ids",     name: "IDS Engine" },
  { key: "lc",      name: "Log Collector" },
  { key: "soar",    name: "SOAR Platform" },
];

const initialState = () =>
  SYSTEM_DEFINITIONS.reduce((acc, s) => ({ ...acc, [s.key]: "ok" }), {});

/**
 * useSystemHealth — simulates randomised health state changes for SOC systems.
 *
 * @param {boolean} paused — when true health states are frozen
 * @returns {{ systems: Array<{ key, name, status }> }}
 */
export function useSystemHealth(paused) {
  const [states, setStates] = useState(initialState);

  useEffect(() => {
    if (paused) return;

    const id = setInterval(() => {
      setStates(() => {
        const next = {};
        SYSTEM_DEFINITIONS.forEach(({ key }) => {
          const r = Math.random();
          if (r < P_ERROR) next[key] = "error";
          else if (r < P_WARN) next[key] = "warn";
          else next[key] = "ok";
        });
        return next;
      });
    }, HEALTH_TICK_MS);

    return () => clearInterval(id);
  }, [paused]);

  const systems = SYSTEM_DEFINITIONS.map((s) => ({
    ...s,
    status: states[s.key],
  }));

  return { systems };
}
