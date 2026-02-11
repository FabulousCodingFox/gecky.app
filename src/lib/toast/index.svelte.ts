let count = 0;

export type ToastOptions = {
  text?: string;
  description?: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
};

export type ToastInternal = ToastOptions & {
  id: number;
};

const DEFAULT_OPTIONS: ToastOptions = {
  text: 'Info',
  description: '',
  type: 'info',
  duration: 5000
};

export const toast_store: ToastInternal[] = $state([]);

function toastFactory() {
  function push(opts: ToastOptions): number {
    const optsWithDefaults: ToastInternal = { ...DEFAULT_OPTIONS, ...opts, id: count++ };

    toast_store.push(optsWithDefaults);

    return optsWithDefaults.id;
  }

  function set(id: number, opts: ToastOptions) {
    const index = toast_store.findIndex((t) => t.id === id);
    if (index === -1) return;
    toast_store[index] = { ...toast_store[index], ...opts };
  }

  function pop(id: number) {
    const index = toast_store.findIndex((t) => t.id === id);
    if (index === -1) return;
    toast_store.splice(index, 1);
  }

  function info(text: string, description: string = '') {
    push({ text, type: 'info', description });
  }

  function success(text: string, description: string = '') {
    push({ text, type: 'success', description });
  }

  function error(text: string, description: string = '') {
    push({ text, type: 'error', description });
  }

  return {
    push,
    set,
    pop,
    info,
    success,
    error
  };
}

const toast = toastFactory();
export default toast;
