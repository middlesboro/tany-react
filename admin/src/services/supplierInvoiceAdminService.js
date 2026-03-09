import { authFetch } from '../utils/authFetch';

const API_ADMIN_URL = `${import.meta.env.VITE_BACKEND_BASE_URL}${import.meta.env.VITE_API_URL}/admin/supplier-invoices`;

export const getSupplierInvoices = async (page = 0, sort = 'id,asc', size = 20, query = '', createDateFrom = '', createDateTo = '') => {
  let url = `${API_ADMIN_URL}?page=${page}&size=${size}&sort=${sort}`;
  if (query) url += `&query=${encodeURIComponent(query)}`;
  if (createDateFrom) url += `&createDateFrom=${encodeURIComponent(createDateFrom)}`;
  if (createDateTo) url += `&createDateTo=${encodeURIComponent(createDateTo)}`;

  const response = await authFetch(url);
  return response.json();
};

export const getSupplierInvoice = async (id) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`);
  return response.json();
};

export const createSupplierInvoice = async (dto) => {
  const response = await authFetch(API_ADMIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create supplier invoice');
  }
  return response.json();
};

export const updateSupplierInvoice = async (id, dto) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update supplier invoice');
  }
  return response.json();
};

export const deleteSupplierInvoice = async (id) => {
  const response = await authFetch(`${API_ADMIN_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
     const errorData = await response.json().catch(() => ({}));
     throw new Error(errorData.message || 'Failed to delete supplier invoice');
  }
};

export const exportSupplierInvoicesCsv = async (createDateFrom = '', createDateTo = '') => {
  let url = `${API_ADMIN_URL}/export?`;
  const params = new URLSearchParams();
  if (createDateFrom) params.append('createDateFrom', createDateFrom);
  if (createDateTo) params.append('createDateTo', createDateTo);
  url += params.toString();

  const response = await authFetch(url);
  if (!response.ok) {
    throw new Error('Failed to export supplier invoices');
  }
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'supplier-invoices.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
};
