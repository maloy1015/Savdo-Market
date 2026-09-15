import api from "./api";

export const authService = {
  async register({ first_name, email, phone, password, password_confirm }) {
    const { data } = await api.post("/auth/register/", {
      first_name,
      email,
      phone,
      password,
      password_confirm,
    });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return data.user;
  },

  async login({ login, password }) {
    const { data } = await api.post("/auth/login/", { login, password });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    return data.user;
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  async getProfile() {
    const { data } = await api.get("/users/profile/");
    return data;
  },

  async updateProfile(payload) {
    const { data } = await api.patch("/users/profile/", payload);
    return data;
  },

  async uploadAvatar(file) {
    const form = new FormData();
    form.append("avatar", file);
    const { data } = await api.put("/users/profile/image/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  isAuthenticated() {
    return !!localStorage.getItem("access_token");
  },
};
