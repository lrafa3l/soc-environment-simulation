import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import LogFeed from "./components/LogFeed";
import AlertList from "./components/AlertList";
import IncidentPanel from "./components/IncidentPanel";
import SystemHealth from "./components/SystemHealth";
import { useLogEngine } from "./hooks/useLogEngine";
import { useAlerts } from "./hooks/useAlerts";
import { useSystemHealth } from "./hooks/useSystemHealth";
import "./index.css";

/**
 * App — root component for the SOC Environment Simulation.
 *
 * Wires together the three main simulation engines (log, alerts, health)
 * and distributes their state to the dashboard panels.
 */
export default function App() {
  const [paused, setPaused] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const { logs, clearLogs, totalEvents, epsHistory } = useLogEngine(paused);
  const { alerts, addAlert, resolveAlert, escalateAlert } = useAlerts();
  const { systems } = useSystemHealth(paused);

  /* Feed high-severity log events into the alert queue */
  const prevLogsLen = useRef(0);
  useEffect(() => {
    if (logs.length === prevLogsLen.current) return;
    const newest = logs.slice(prevLogsLen.current);
    prevLogsLen.current = logs.length;
    newest.forEach((log) => {
      if (["CRIT", "HIGH", "MED"].includes(log.severity)) {
        addAlert(log);
      }
    });
  }, [logs, addAlert]);

  /* Deselect alert once it's resolved */
  useEffect(() => {
    if (selectedAlert && !alerts.find((a) => a.id === selectedAlert.id)) {
      setSelectedAlert(null);
    }
  }, [alerts, selectedAlert]);

  const openAlerts = alerts.filter((a) => a.status === "open");
  const critCount = openAlerts.filter((a) => a.severity === "CRIT").length;

  return (
    <div className="app">
      <Header paused={paused} onTogglePause={() => setPaused((p) => !p)} />

      <main className="dashboard">
        <StatCards
          totalEvents={totalEvents}
          openAlerts={openAlerts.length}
          critCount={critCount}
          epsHistory={epsHistory}
        />

        <div className="grid-2col">
          <LogFeed logs={logs} onClear={clearLogs} />
          <AlertList
            alerts={alerts}
            selected={selectedAlert}
            onSelect={setSelectedAlert}
          />
        </div>

        <div className="grid-2col">
          <IncidentPanel
            alert={selectedAlert}
            onResolve={() => resolveAlert(selectedAlert.id)}
            onEscalate={() => escalateAlert(selectedAlert.id)}
          />
          <SystemHealth systems={systems} epsHistory={epsHistory} />
        </div>
      </main>
    </div>
  );
}
