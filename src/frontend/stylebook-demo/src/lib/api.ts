import type { Appointment, AppointmentInput, Service, ServiceInput, Settings } from "../types";
import { DEFAULT_SERVICES } from "./defaultServices";

// No backend actor, canister ID, live data, or network calls in this adapter.
const prefix = "terrylxd-stylebook-demo-v1:";
const defaults: Settings = {startWeekOnMonday:true,darkMode:false,mobileWeekLayout:"three-day",calendarDensity:"compact",workingHoursStart:"08:00",workingHoursEnd:"19:00"};
function read<T>(key:string,fallback:T):T {
  try { return JSON.parse(sessionStorage.getItem(prefix+key)??"null")??structuredClone(fallback); } catch { return structuredClone(fallback); }
}
function write(key:string,value:unknown) { sessionStorage.setItem(prefix+key,JSON.stringify(value)); }
function dateAt(offset:number) {
  const d=new Date(); d.setDate(d.getDate()+offset);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function fixtures():Appointment[] {
  const names=["Avery Morgan","Jordan Ellis","Riley Brooks","Cameron Reed","Taylor Bennett","Morgan Hayes","Parker Lane","Quinn Carter","Harper Collins","Rowan Davis","Sage Wilson","Emerson Blake"];
  return names.flatMap((clientName,index)=>[-14,0,3].map((offset,visit)=>{
    const service=DEFAULT_SERVICES[index%DEFAULT_SERVICES.length];
    const startTime=`${String(9+(index%4)*2).padStart(2,"0")}:${index%2?"30":"00"}`;
    let cursor=Number(startTime.slice(0,2))*60+Number(startTime.slice(3));
    const phases=service.phases.map(p=>{
      const time=`${String(Math.floor(cursor/60)).padStart(2,"0")}:${String(cursor%60).padStart(2,"0")}`;
      cursor+=p.durationMinutes; return {...p,startTime:time};
    });
    return {id:`sample-${index}-${visit}`,clientName,serviceId:service.id,serviceName:service.name,date:dateAt(offset+Math.floor(index/4)),startTime,durationMinutes:service.totalDurationMinutes,price:service.price,phases,color:service.color,status:visit===0?"completed" as const:"scheduled" as const,notes:"Fictional portfolio sample. No real client information.",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  }));
}
export async function getAppointments() { return read<Appointment[]>("appointments",fixtures()); }
export async function getAppointmentsByDateRange(start:string,end:string) { return (await getAppointments()).filter(a=>a.date>=start&&a.date<=end); }
export async function getAppointmentsByClient(name:string) { return (await getAppointments()).filter(a=>a.clientName.toLowerCase().includes(name.toLowerCase())); }
export async function getClientNames() { return [...new Set((await getAppointments()).map(a=>a.clientName))].sort(); }
export async function createAppointment(input:AppointmentInput):Promise<Appointment> {
  const item={...input,id:crypto.randomUUID(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  write("appointments",[...await getAppointments(),item]); return item;
}
export async function updateAppointment(id:string,patch:Partial<AppointmentInput>):Promise<Appointment> {
  const items=await getAppointments(); const index=items.findIndex(a=>a.id===id);
  if(index<0) throw new Error("Sample appointment not found");
  items[index]={...items[index],...patch,updatedAt:new Date().toISOString()}; write("appointments",items); return items[index];
}
export async function deleteAppointment(id:string) { write("appointments",(await getAppointments()).filter(a=>a.id!==id)); }
export async function getServices() { return read<Service[]>("services",DEFAULT_SERVICES); }
export async function createService(input:ServiceInput) { const item={...input,id:crypto.randomUUID()}; write("services",[...await getServices(),item]); return item; }
export async function updateService(id:string,patch:Partial<ServiceInput>) {
  const items=await getServices(); const index=items.findIndex(a=>a.id===id);
  if(index<0) throw new Error("Sample service not found");
  items[index]={...items[index],...patch}; write("services",items); return items[index];
}
export async function deleteService(id:string) { write("services",(await getServices()).filter(s=>s.id!==id)); }
export async function getSettings() { return read<Settings>("settings",defaults); }
export async function updateSettings(patch:Partial<Settings>) { const value={...await getSettings(),...patch}; write("settings",value); return value; }
