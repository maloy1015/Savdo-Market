import api from "./api";

export const cartService = {
  async get() {
    const { data } = await api.get("/cart/");
    return data;
  },
  async add(productId, quantity = 1) {
    const { data } = await api.post("/cart/", { product: productId, quantity });
    return data;
  },
  async updateQuantity(itemId, quantity) {
    const { data } = await api.put("/cart/", { item_id: itemId, quantity });
    return data;
  },
  async removeItem(itemId) {
    const { data } = await api.delete(`/cart/items/${itemId}/`);
    return data;
  },
  async clear() {
    await api.delete("/cart/");
  },
};

export const orderService = {
  async list() {
    const { data } = await api.get("/orders/");
    return data.results || data;
  },
  async create(payload) {
    const { data } = await api.post("/orders/", payload);
    return data;
  },
  async detail(id) {
    const { data } = await api.get(`/orders/${id}/`);
    return data;
  },
};

export const favoriteService = {
  async list() {
    const { data } = await api.get("/favorites/");
    return data.results || data;
  },
  async add(productId) {
    const { data } = await api.post("/favorites/", { product: productId });
    return data;
  },
  async remove(favoriteId) {
    await api.delete(`/favorites/${favoriteId}/`);
  },
};

export const addressService = {
  async list() {
    const { data } = await api.get("/addresses/");
    return data.results || data;
  },
  async create(payload) {
    const { data } = await api.post("/addresses/", payload);
    return data;
  },
  async remove(id) {
    await api.delete(`/addresses/${id}/`);
  },
};
