/**
 * Node >= 22.4 ships the experimental Web Storage API, and it is enabled by
 * default from Node 24 onwards. When the process is started without
 * `--localstorage-file`, `globalThis.localStorage` resolves to an empty stub: it
 * is an object, so `typeof localStorage !== "undefined"` is true, but it has no
 * `getItem`/`setItem` methods, and the first read emits
 * `Warning: --localstorage-file was provided without a valid path`.
 *
 * Libraries that feature-detect the browser with `typeof localStorage !==
 * "undefined"` then take the browser branch during SSR and crash with
 * `TypeError: localStorage.getItem is not a function`. Next's own dev overlay
 * does exactly this (see `next/dist/client/components/react-dev-overlay/ui/
 * components/shadow-portal.js`), which turns every rendered page into a 500.
 *
 * Removing these server-side globals restores the Node environment those guards
 * were written against, so they correctly resolve to `false` again. Browser
 * storage is unaffected: instrumentation only ever runs on the server, so
 * client-side auth tokens and theme preferences keep working as before.
 */
export function register() {
  const globals = globalThis as Record<string, unknown>;

  // An explicit `--localstorage-file=<path>` means Web Storage was configured on
  // purpose, so leave it alone.
  const flags =
    typeof process === "undefined"
      ? []
      : [...(process.execArgv ?? []), process.env.NODE_OPTIONS ?? ""];

  if (flags.some((flag) => /--localstorage-file=\S/.test(flag))) {
    return;
  }

  for (const key of ["localStorage", "sessionStorage"] as const) {
    // Inspect the property descriptor rather than the value: Node installs these
    // as lazy getters, and *reading* one is what emits the warning above.
    if (Object.getOwnPropertyDescriptor(globals, key)?.configurable) {
      delete globals[key];
    }
  }
}
