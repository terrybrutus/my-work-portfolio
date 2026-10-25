import { beforeEach, describe, expect, it } from "vitest";
import * as demo from "../../stylebook-demo/src/lib/api";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

beforeEach(()=>sessionStorage.clear());
describe("isolated Stylebook portfolio sample",()=>{
  it("starts with fictional clients and supports local edits without changing the fixtures",async()=>{
    const initial=await demo.getAppointments();
    expect(new Set(initial.map(a=>a.clientName)).size).toBe(12);
    expect(initial.every(a=>a.notes?.includes("Fictional"))).toBe(true);
    await demo.updateAppointment(initial[0].id,{clientName:"Demo edit"});
    expect((await demo.getAppointments())[0].clientName).toBe("Demo edit");
    sessionStorage.clear();
    expect((await demo.getAppointments())[0].clientName).toBe(initial[0].clientName);
  });
  it("can create a sample booking and service only in this tab",async()=>{
    const existing=(await demo.getAppointments())[0];
    const created=await demo.createAppointment({...existing,clientName:"Example visitor"});
    expect((await demo.getAppointments()).some(a=>a.id===created.id)).toBe(true);
    await demo.deleteAppointment(created.id);
    expect((await demo.getAppointments()).some(a=>a.id===created.id)).toBe(false);
    const services=await demo.getServices();
    const service=await demo.createService({...services[0],name:"Sample service"});
    await demo.updateService(service.id,{price:35});
    expect((await demo.getServices()).find(s=>s.id===service.id)?.price).toBe(35);
    await demo.deleteService(service.id);
    expect((await demo.getServices()).length).toBe(services.length);
  });
  it("contains no network or backend adapter and blocks connections in the entry",()=>{
    const root=resolve("stylebook-demo");
    const api=readFileSync(resolve(root,"src/lib/api.ts"),"utf8");
    const startup=readFileSync(resolve(root,"src/hooks/useInitData.ts"),"utf8");
    const html=readFileSync(resolve(root,"index.html"),"utf8");
    expect(api+startup).not.toMatch(/fetch\s*\(|createActor|backend_canister_id|XMLHttpRequest|WebSocket/);
    expect(html).toContain("connect-src 'none'");
    expect(html).toContain("form-action 'none'");
    expect(html).toContain("/assets/project-opening.js");
  });
});
