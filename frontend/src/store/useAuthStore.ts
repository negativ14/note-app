import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export interface User {
    _id: string;
    email: string;
    username: string;
    password?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AuthState {
    authUser: User | null;
    isSigningUp: boolean;
    isLoggingIn: boolean;
    isCheckingAuth: boolean;
    checkAuth: () => Promise<void>;
    signup: (formData: any) => Promise<boolean>;
    signin: (formData: any) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        const token = localStorage.getItem("Authorization");

        if (!token) {
            console.log("No token found. Skipping authentication check.");
            set({ authUser: null, isCheckingAuth: false });
            return;
        }

        try {
            // important to set the token in the axios instance before making the request
            axiosInstance.defaults.headers.common['Authorization'] = token;
            const response = await axiosInstance.get('/check-auth');
            set({ authUser: response.data });
            console.log("User authenticated:", response.data);
        } catch (error) {
            console.error("Authentication check failed:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data: any) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosInstance.post('/signup', data);
            console.log(response.data);

            if (response.data.message.includes('successfully')) {
                toast.success("Account created successfully");
                return true;
            } else {
                toast.error(response.data.message);
                return false;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An unexpected error occurred");
            console.log(error);
            return false;
        } finally {
            set({ isSigningUp: false });
        }
    },

    signin: async (data: any) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post('/signin', data);
            set({ authUser: response.data.user });
            console.log(response.data.user);
            //yaha check karna ik bar 

            if (response.data.message.includes('successfully')) {
                toast.success("Logged In successfully");
                const token = response.data.token;
                console.log("Token:", token);
                localStorage.setItem('Authorization', token);
                return true;
            } else {
                toast.error(response.data.message);
                return false;
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "An unexpected error occurred");
            return false;
        } finally {
            set({ isLoggingIn: false });
        }
    },

}));