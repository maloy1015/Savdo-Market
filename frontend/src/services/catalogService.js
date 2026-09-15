import api from "./api";

export const categoryService = {
  async list() {
    const { data } = await api.get("/categories/");
    return data.results || data;
  },
};

export const bannerService = {
  async list() {
    const { data } = await api.get("/banners/");
    return data.results || data;
  },
};

export const productService = {
  async list(params = {}) {
    const { data } = await api.get("/products/", { params });
    return data; // { count, next, previous, results }
  },

  async detail(slug) {
    const { data } = await api.get(`/products/${slug}/`);
    return data;
  },

  async featured() {
    const { data } = await api.get("/products/", { params: { is_featured: true, page_size: 8 } });
    return data.results || data;
  },
};

export const reviewService = {
  async listByProduct(productId) {
    const { data } = await api.get("/reviews/", { params: { product: productId } });
    return data.results || data;
  },
  async create(payload) {
    const { data } = await api.post("/reviews/", payload);
    return data;
  },
};
