import {useEffect, useRef, useState} from "react";
import {createPortal} from "react-dom";

export function WorduelLaunchSignup() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "saved" | "error">("idle");
  const trigger = useRef<HTMLButtonElement>(null);
  const email = useRef<HTMLInputElement>(null);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  useEffect(() => {
    if (open) email.current?.focus();
  }, [open]);

  return <>
    <button ref={trigger} className="primary-cta" type="button" onClick={() => setOpen(true)}>
      Notify me when it launches
    </button>
    {open && createPortal(
      <div className="launch-signup-backdrop" data-launch-signup="true" onKeyDown={event => {
        event.stopPropagation();
        if (event.key === "Escape") close();
        if (event.key === "Tab") {
          const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled):not([type="hidden"]):not([tabindex="-1"]), a[href]'));
          const first = controls[0];
          const last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      }}>
        <div className="launch-signup-panel" role="dialog" aria-modal="true" aria-labelledby="worduel-signup-title">
          <button className="project-live-link" type="button" onClick={close}>Close signup</button>
          <p className="retro-tv-kicker">Coming soon</p>
          <h2 id="worduel-signup-title">Try Worduel when it launches</h2>
          {status === "saved" ? <p role="status">You're on the list. Terry will email you the game link when Worduel launches.</p> :
            <form name="worduel-launch" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" onSubmit={async event => {
              event.preventDefault();
              if (status === "sending") return;
              const form = event.currentTarget;
              if (!form.reportValidity()) return;
              if (import.meta.env.DEV) { setStatus("error"); return; }
              setStatus("sending");
              try {
                const body = new URLSearchParams();
                new FormData(form).forEach((value, key) => { if (typeof value === "string") body.append(key, value); });
                const response = await fetch("/worduel-notify/", {method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"}, body: body.toString()});
                if (!response.ok) throw new Error("Signup not received");
                setStatus("saved");
              } catch { setStatus("error"); }
            }}>
              <input type="hidden" name="form-name" value="worduel-launch" />
              <p hidden><label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
              <label className="launch-email-label" htmlFor="worduel-email">Email address</label>
              <input ref={email} id="worduel-email" name="email" type="email" autoComplete="email" required maxLength={254} />
              <label className="launch-consent"><input name="consent" type="checkbox" value="yes" required /> Email me once with the link when Worduel launches. No newsletter.</label>
              <button className="primary-cta" type="submit" disabled={status === "sending"}>{status === "sending" ? "Saving..." : "Notify me"}</button>
              {status === "error" && <p role="alert">{import.meta.env.DEV ? "Signups are available on terrylxd.com. This local preview hasn't sent your email." : "Your signup wasn't confirmed. Please try again or email Terry."}</p>}
              <p className="launch-privacy">Your email is stored privately with Netlify for this launch notification. To request removal, <a href="mailto:terrbrutus@gmail.com?subject=Remove%20my%20Worduel%20launch%20signup">email Terry</a>.</p>
            </form>}
        </div>
      </div>, document.body)}
  </>;
}
