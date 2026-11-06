/** One-shot signal fired when the preloader doors have opened. */
let done = false;
const listeners = new Set<() => void>();

export function onIntro(fn: () => void) {
  if (done) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function emitIntro() {
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}
