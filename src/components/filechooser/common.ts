import { m } from "$lib/paraglide/messages";

export const ACCEPTED_FILE_EXTENSION = '.hg';
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

export async function saveHandle(handle: FileSystemDirectoryHandle) {
  const request = indexedDB.open('fs-handles', 1);

  request.onupgradeneeded = () => {
    request.result.createObjectStore('handles');
  };

  request.onsuccess = () => {
    const db = request.result;
    const tx = db.transaction('handles', 'readwrite');
    tx.objectStore('handles').put(handle, 'saves-folder');
  };
}

export async function loadHandle(): Promise<FileSystemDirectoryHandle> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fs-handles', 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore('handles');
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('handles', 'readonly');
      const getReq = tx.objectStore('handles').get('saves-folder');

      getReq.onsuccess = () => resolve(getReq.result || null);
      getReq.onerror = () => reject(getReq.error);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function deleteHandle(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fs-handles', 1);

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('handles', 'readwrite');
      tx.objectStore('handles').delete('saves-folder');

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };

    request.onerror = () => reject(request.error);
  });
}

export async function createOrGetHandle(): Promise<FileSystemDirectoryHandle | null> {
  let handle = await loadHandle();
  if (!handle) {
    handle = await window.showDirectoryPicker({
      id: 'saves',
      mode: 'readwrite'
    });
  }
  if (!handle) return null;

  const perm = await handle.queryPermission({ mode: "readwrite" });

  if (perm === "granted") return handle;

  if (perm === "prompt") {
    const req = await handle.requestPermission({ mode: "readwrite" });
    if (req === "granted") return handle;
  }

  return null;
}


export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error(`Failed to read file: ${reader.error?.message}`));
    reader.readAsArrayBuffer(file);
  });
}


export function validateFile(file: File | null): { isValid: boolean; errorTitle?: string; errorDescription?: string } {
  if (!file) {
    return {
      isValid: false,
      errorTitle: m.component_filechooser_toast_error_none_title(),
      errorDescription: m.component_filechooser_toast_error_none_desc()
    };
  }

  if (!file.name.endsWith(ACCEPTED_FILE_EXTENSION)) {
    return {
      isValid: false,
      errorTitle: m.component_filechooser_toast_error_invalidtype_title(),
      errorDescription: m.component_filechooser_toast_error_invalidtype_desc()
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      errorTitle: m.component_filechooser_toast_error_toolarge_title(),
      errorDescription: m.component_filechooser_toast_error_toolarge_desc({ maxSize: (MAX_FILE_SIZE / (1024 * 1024)).toString() })
    };
  }

  return { isValid: true };
}