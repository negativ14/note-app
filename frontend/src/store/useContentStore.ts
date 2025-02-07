import { create } from "zustand";
import toast from "react-hot-toast/headless";
import { axiosInstance } from "../lib/axios";
import mongoose from 'mongoose';

export interface Card {
    _id: string;
    title: string,
    type: string,
    notes: string,
    transcript: string,
    image: string[],
    share: boolean,
    audio: string,
    favourite: boolean,
    shareLink: string,
    date: Date,
    creatorId: mongoose.Types.ObjectId
    createdAt: Date,
    updatedAt: Date,
}

interface ContentStore {
    content: Card[],
    isContentLoading: boolean,
    isContentCreating: boolean,
    isContentUpdating: boolean,
    isContentDeleting: boolean,
    isUploadingImage: boolean,
    openModel: boolean,
    voiceNoteModel: boolean,
    noteModel: boolean,
    activePage: string,
    selectedCard: any | null, // State to hold the selected card
    setActivePage: (value: string) => void,
    setVoiceNoteModel: (value: boolean) => void,
    setNoteModel: (value: boolean) => void,
    setSelectedCard: (card: any) => void,
    getContent: (searchText: string) => Promise<any>,
    createCard: (data: any) => Promise<any>,
    updateCard: (data: any) => Promise<any>,
    deleteCard: (cardId: any) => Promise<any>,
    setOpenModel: (value: boolean) => void,
    uploadImage: (data: any) => void,
    uploadAudio: (formData: FormData) => Promise<string>,
    // shareCard: (cardId: any) => Promise<any>,
}


export const useContentStore = create<ContentStore>((set) => ({
    content: [],
    isContentLoading: false,
    isContentCreating: false,
    isContentUpdating: false,
    isContentDeleting: false,
    openModel: false,
    selectedCard: null,
    isUploadingImage: false, // State to hold the selected card]
    voiceNoteModel: false,
    noteModel: false,
    activePage: 'home',

    setActivePage: (value: string) => set({ activePage: value}),
    setSelectedCard: (card: any) => set({ selectedCard: card }),
    setNoteModel: (value: boolean) => set({ noteModel: value }),
    setVoiceNoteModel: (value: boolean) => set({ voiceNoteModel: value }),

    getContent: async (searchText: string) => {
        set({ isContentLoading: true });
        try {
            const response = await axiosInstance.get(`/get-content?title=${searchText}`);
            toast.success("Content fetched successfully");
            set({ content: response.data.data });
            if (response.data.message.includes("successfully"))
                return true;
        } catch (error) {
            console.error("Error fetching content:", error);
            toast.error("Error fetching content");
        } finally {
            set({ isContentLoading: false });
        }
    },

    createCard: async (data: any) => {
        set({ isContentCreating: true });
        try {
            const response = await axiosInstance.post(`/content/create-content`, data);
            toast.success("Content created successfully");
            if (response.data.message.includes("successfully"))
                return true;
        } catch (error) {
            console.error("Error creating content:", error);
            toast.error("Error creating content");
            return null;
        } finally {
            set({ isContentCreating: false });
        }
    },

    uploadImage: async (data: any) => {
        set({ isUploadingImage: true });
        try {
            const response = await axiosInstance.put(`/content/upload-image`, data);
            toast.success("Image uploaded successfully");
            if (response.data.message.includes("successfully"))
                return true;
        } catch (error) {
            console.error("Error while image uploading:", error);
            toast.error("Error while image uploading");
            return false;
        } finally {
            set({ isUploadingImage: false });
        }
    },

    uploadAudio: async (formData: FormData) => {
        try {
            console.log("from zu", formData);
            // const formData = new FormData();
            // formData.append("audio", audio);
            // formData.append("filename","trying bro")
            // const arrayBuffer = await audio.arrayBuffer();
            // const buffer = Buffer.from(arrayBuffer);
            // console.log("buffer zu", buffer);
            const response = await axiosInstance.post('/content/upload-audio', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.audioUrl) {
                return response.data.audioUrl;
            }
            return "Upload error";
        } catch (error) {
            console.error("Error uploading audio:", error);
            return "Upload error";
        }
    },



    updateCard: async (data: any) => {
        set({ isContentUpdating: true });
        try {
            const response = await axiosInstance.put(`/content/update-content`, data);
            toast.success("Content updated successfully");
            if (response.data.message.includes("successfully"))
                return true;
        } catch (error) {
            console.error("Error updating content:", error);
            toast.error("Error updating content");
            return false;
        } finally {
            set({ isContentUpdating: false });
        }
    },

    deleteCard: async (cardId: string) => {
        set({ isContentDeleting: true });
        try {
            const response = await axiosInstance.delete(`/content/delete-content`, { data: { _id: cardId } });
            toast.success("Content deleted successfully");
            if (response.data.message.includes("successfully"))
                return true;
        } catch (error) {
            console.error("Error deleting content:", error);
            toast.error("Error deleting content");
            return false;
        } finally {
            set({ isContentDeleting: false });
        }
    },

    setOpenModel: (value: boolean) => {
        set({ openModel: value });
    }
    // shareCard: async (cardId: string) => {
    //     try {
    //         const response = await axiosInstance.post(`/content/share-content`, { _id: cardId });
    //         // toast.success("Content shared successfully");
    //         return response;
    //     } catch (error) {
    //         console.error("Error sharing content:", error);
    //         toast.error("Error sharing content");
    //     }
    // },
}))

