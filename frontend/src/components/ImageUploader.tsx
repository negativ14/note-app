import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import { useContentStore } from "../store/useContentStore";

const ImageUploader = () => {
    const [images, setImages] = useState<string[]>([]);
    const { uploadImage, selectedCard } = useContentStore();
    
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    // Reset images when the selectedCard changes
    useEffect(() => {
        setImages([]);
    }, [selectedCard]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return toast.error("Image not selected");

        const file = files[0];
        if (!file) return toast.error("Image not selected");

        if (file.size > MAX_FILE_SIZE) {
            return toast.error("File size exceeds 5MB limit");
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                const base64Image = reader.result as string;
                const _id = selectedCard._id;

                setImages(prev => [...prev, base64Image]);
                uploadImage({ image: base64Image, _id });
                toast.success("Image added successfully");
            }
        };

        reader.onerror = (error) => {
            toast.error("File reading error");
            console.error("File reading error:", error);
        };

        reader.readAsDataURL(file);
    };

    const renderImagePreview = (
        <div className="flex flex-wrap gap-2">
            {images.length > 0 && images.map((image, index) => (
                <div key={index} className="relative">
                    <img
                        src={image}
                        alt={`Selected ${index}`}
                        className="h-[70px] w-[70px] rounded border border-gray-300 object-cover"
                    />
                </div>
            ))}
            <label htmlFor="imageInput" className="cursor-pointer">
                <div className="h-[70px] w-[70px] rounded border border-gray-300 flex justify-center items-center hover:bg-gray-100">
                    <BsPlus size={20} />
                </div>
            </label>
        </div>
    );

    return (
        <div className="flex flex-col gap-2">
            {renderImagePreview}
            <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default ImageUploader;