const API_URL = '/api/phones';

async function request(path = '', options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.messages?.join(', ') || 'Une erreur est survenue.';
    throw new Error(message);
  }

  return data;
}

export function getPhones() {
  return request();
}

export function createPhone(phone) {
  return request('', {
    method: 'POST',
    body: JSON.stringify(phone),
  });
}

export function updatePhone(id, phone) {
  return request(`/${id}`, {
    method: 'PUT',
    body: JSON.stringify(phone),
  });
}

export function deletePhone(id) {
  return request(`/${id}`, {
    method: 'DELETE',
  });
}
