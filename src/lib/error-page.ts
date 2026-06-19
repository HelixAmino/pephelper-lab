function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatError(error: unknown): { name: string; message: string; stack: string } {
  if (error instanceof Error) {
    return {
      name: error.name || "Error",
      message: error.message || "(no message)",
      stack: error.stack || "(no stack)",
    };
  }
  if (error && typeof error === "object") {
    try {
      return { name: "Object", message: JSON.stringify(error, null, 2), stack: "" };
    } catch {
      return { name: "Object", message: String(error), stack: "" };
    }
  }
  return { name: "Unknown", message: String(error ?? "(no error value)"), stack: "" };
}

export function renderErrorPage(error?: unknown): string {
  const debug = error
    ? (() => {
        const { name, message, stack } = formatError(error);
        return `
      <details open style="margin: 1.5rem auto 0; max-width: 56rem; text-align: left;">
        <summary style="cursor: pointer; font-weight: 600; color: #b91c1c;">${escapeHtml(name)}: ${escapeHtml(message)}</summary>
        <pre style="margin-top: 0.75rem; padding: 1rem; background: #111; color: #f3f4f6; border-radius: 0.5rem; overflow: auto; font-size: 12px; line-height: 1.5; white-space: pre-wrap; word-break: break-word;">${escapeHtml(stack)}</pre>
      </details>`;
      })()
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 56rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
      ${debug}
    </div>
  </body>
</html>`;
}
