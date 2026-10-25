import { useEffect } from "react";
import * as api from "../lib/api";
import { useAppStore } from "../store/useAppStore";
let initialized = false;
export function useInitData() {
  useEffect(() => {
    if (initialized) return;
    initialized = true;
    void Promise.all([api.getAppointments(),api.getServices(),api.getSettings()]).then(([appointments,services,settings])=>{
      const store=useAppStore.getState();
      store.setAppointments(appointments); store.setServices(services); store.setSettings(settings);
      for(const key of ["appointments","services","settings"] as const) store.setLoading(key,false);
    });
  },[]);
}
