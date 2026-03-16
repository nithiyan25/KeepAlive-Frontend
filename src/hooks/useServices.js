import { useState, useEffect, useCallback } from "react";
import { api } from "../Api";

export function useServices() {
  const [services, setServices] = useState([]);
  const [log,      setLog]      = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const refresh = useCallback(async () => {
    try {
      const [svcs, logData] = await Promise.all([api.getServices(), api.getLog()]);
      setServices(svcs);
      setLog(logData);
      setError(null);
    } catch (e) {
      setError("Cannot reach backend. Is it running?");
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 15000);
    return () => clearInterval(id);
  }, [refresh]);

  const addService = async (data) => {
    await api.createService(data);
    setTimeout(refresh, 1200);
  };

  const updateService = async (id, data) => {
    const updated = await api.updateService(id, data);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const deleteService = async (id) => {
    await api.deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const pingNow = async (id) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "pinging" } : s))
    );
    const updated = await api.pingService(id);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
    const newLog = await api.getLog();
    setLog(newLog);
  };

  const toggleService = async (id, enabled) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled } : s))
    );
    await api.updateService(id, { enabled });
  };

  return {
    services, log, loading, error,
    refresh, addService, updateService, deleteService, pingNow, toggleService,
  };
}