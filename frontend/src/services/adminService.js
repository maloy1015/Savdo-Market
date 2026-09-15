import api from "./api";

const unwrap = (res) => (Array.isArray(res.data) ? res.data : res.data.results ?? res.data);

export const adminCategoryService = {
  list: () => api.get("/categories/").then(unwrap),
  create: (data) => api.post("/categories/", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  update: (id, data) => api.patch(`/categories/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}/`),
};

export const adminProductService = {
  list: (params = {}) => api.get("/products/", { params: { page_size: 50, ...params } }).then((r) => r.data),
  create: (data) => api.post("/products/", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  update: (idOrSlug, data) => api.patch(`/products/${idOrSlug}/`, data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  remove: (idOrSlug) => api.delete(`/products/${idOrSlug}/`),
};

export const adminBannerService = {
  list: () => api.get("/banners/").then(unwrap),
  create: (data) => api.post("/banners/", data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  update: (id, data) => api.patch(`/banners/${id}/`, data, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data),
  remove: (id) => api.delete(`/banners/${id}/`),
};

export const adminOrderService = {
  list: (params = {}) => api.get("/orders/", { params: { page_size: 50, ...params } }).then((r) => r.data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/`, { status }).then((r) => r.data),
};

export const adminUserService = {
  list: (params = {}) => api.get("/admin/users/", { params: { page_size: 50, ...params } }).then((r) => r.data),
  toggleActive: (id) => api.patch(`/admin/users/${id}/toggle_active/`).then((r) => r.data),
  toggleStaff: (id) => api.patch(`/admin/users/${id}/toggle_staff/`).then((r) => r.data),
  remove: (id) => api.delete(`/admin/users/${id}/`),
};

export const adminReviewService = {
  list: (params = {}) => api.get("/reviews/", { params: { page_size: 50, ...params } }).then(unwrap),
  remove: (id) => api.delete(`/reviews/${id}/`),
};

export const adminAddressService = {
  list: () => api.get("/addresses/").then(unwrap),
};
