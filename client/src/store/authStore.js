import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api.js";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      register: async (formData) => {
        try {
          set({ loading: true, error: null });

          const { data } = await api.post("/auth/register", formData);

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return {
            success: true,
          };
        } catch (error) {
          const message =
            error.response?.data?.message || "Registration failed";

          set({
            loading: false,
            error: message,
          });

          return {
            success: false,
            message,
          };
        }
      },

      login: async (formData) => {
        try {
          set({ loading: true, error: null });

          const { data } = await api.post("/auth/login", formData);

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          return {
            success: true,
          };
        } catch (error) {
          const message =
            error.response?.data?.message || "Login failed";

          set({
            loading: false,
            error: message,
          });

          return {
            success: false,
            message,
          };
        }
      },

      checkAuth: async()=>{
        try{
          const token = get().token;
          if(!token){
            return;
          }
          set({loading:true,error:null});
          const {data} = await api.get("/auth/me");
          set({
            user:data.user,
            isAuthenticated:true,
            loading:false,
            error:null,
          });
        }catch(error){
          set({
            user:null,
            token:null,
            isAuthenticated:false,
            loading:false,
            error:null,
          });
        }

      },

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        }),
    }),
    {
      name: "smart-commerce-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;