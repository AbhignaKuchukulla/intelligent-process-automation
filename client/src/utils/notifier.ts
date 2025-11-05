type NotifyOpts = { message: string; severity?: 'error' | 'warning' | 'info' | 'success'; duration?: number };

let notifyFn: ((opts: NotifyOpts) => void) | null = null;

export function setNotify(fn: ((opts: NotifyOpts) => void) | null) {
  notifyFn = fn;
}

export function notify(opts: NotifyOpts) {
  try {
    if (notifyFn) notifyFn(opts);
  } catch (e) {
    // swallow to avoid breaking non-UI contexts
    // eslint-disable-next-line no-console
    console.error('Notifier error', e);
  }
}

export default notify;
