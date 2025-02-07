import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL;
console.log("Base URL:", baseUrl);

export const axiosInstance = axios.create({
    baseURL: `${baseUrl}`,
    withCredentials: true,
})