const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';

export async function apiRequest(path, options = {}, retries = 2) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message ?? 'Something went wrong');
    }

    return payload;
  } catch (err) {
    const isNetworkErr = err instanceof TypeError || (err.message && err.message.toLowerCase().includes('failed to fetch'));
    if (isNetworkErr && retries > 0) {
      await new Promise(r => setTimeout(r, 600));
      return apiRequest(path, options, retries - 1);
    }
    throw err;
  }
}

// For multipart/form-data uploads (e.g. resume file upload). No Content-Type
// header is set manually — the browser sets it (with the correct boundary)
// automatically when the body is a FormData instance.
export async function apiUpload(path, formData, { token } = {}, retries = 2) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message ?? 'Upload failed');
    }

    return payload;
  } catch (err) {
    const isNetworkErr = err instanceof TypeError || (err.message && err.message.toLowerCase().includes('failed to fetch'));
    if (isNetworkErr && retries > 0) {
      await new Promise(r => setTimeout(r, 600));
      return apiUpload(path, formData, { token }, retries - 1);
    }
    throw err;
  }
}
