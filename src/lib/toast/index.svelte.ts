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

// Use Map for O(1) access instead of array for better performance
export const toast_store: Map<number, ToastInternal> = $state(new Map());

function toastFactory() {
  function push(opts: ToastOptions): number {
    const optsWithDefaults: ToastInternal = { ...DEFAULT_OPTIONS, ...opts, id: count++ };

    toast_store.set(optsWithDefaults.id, optsWithDefaults);

    return optsWithDefaults.id;
  }

  function set(id: number, opts: ToastOptions) {
    const existing = toast_store.get(id);
    if (!existing) return;
    toast_store.set(id, { ...existing, ...opts });
  }

  function pop(id: number) {
    toast_store.delete(id);
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
