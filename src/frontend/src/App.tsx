import { useCallerUserRole } from "./hooks/useQueries";

export default function App() {
  // Wire the frontend to the backend so the app boots end to end.
  useCallerUserRole();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div
        data-ocid="empty_state"
        className="flex min-h-screen items-center justify-center"
      >
        <p className="text-sm text-muted-foreground">This app is empty.</p>
      </div>
    </main>
  );
}
