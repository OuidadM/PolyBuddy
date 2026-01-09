import api from "./api";

const profileService = {
  getMyProfile: async () => {
    const res = await api.get("/profile/me");
    return res.data;
  },

  updateMyProfile: async (data) => {
    const res = await api.put("/profile/me", data);
    return res.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.post("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return res.data;
  }
};

export default profileService;
