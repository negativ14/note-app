// import { useState, useCallback, memo } from "react";
// import { useContentStore } from "../store/useContentStore";
// import { useAuthStore } from "../store/useAuthStore";
// import toast from "react-hot-toast";

// const CreateNote = memo(() => {
//     const [title, setTitle] = useState("");
//     const [note, setNote] = useState("");

//     const { noteModel, setNoteModel, createCard, getContent } = useContentStore();
//     const { authUser } = useAuthStore();

//     if (!noteModel) return null;

//     const handleSave = useCallback(async () => {
//         if (!title.trim() || !note.trim()) {
//             return toast.error("Please fill in both fields.");
//         }
        
//         try {
//             await createCard({ title, notes: note, creatorId: authUser?._id, type: "text" });
//             getContent("");
//             toast.success("Note created successfully");
//             setTitle("");
//             setNote("");
//             setNoteModel(false);
//         } catch (error) {
//             toast.error("Failed to create note");
//         }
//     }, [title, note, authUser?._id, createCard, getContent, setNoteModel]);

//     const handleCancel = useCallback(() => {
//         setNoteModel(false);
//     }, [setNoteModel]);

//     return (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg w-full max-w-md">
//                 <h2 className="text-2xl font-bold mb-4 text-black">Create Note</h2>
//                 <div className="mb-4">
//                     <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//                         Title
//                     </label>
//                     <input
//                         type="text"
//                         id="title"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
//                         Note
//                     </label>
//                     <textarea
//                         id="note"
//                         value={note}
//                         onChange={(e) => setNote(e.target.value)}
//                         rows={4}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                     ></textarea>
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                     <button
//                         onClick={handleCancel}
//                         className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleSave}
//                         className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
//                     >
//                         Save
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// });

// export default CreateNote;

import { useState } from "react";
import { useContentStore } from "../store/useContentStore";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const CreateNote = () => {
    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");

    const { noteModel, setNoteModel, createCard, getContent } = useContentStore();
    const { authUser } = useAuthStore();

    if (!noteModel) return null;

    const handleSave = async () => {
        if (!title.trim() || !note.trim()) {
            toast.error("Please fill in both fields.");
            return;
        }
        
        try {
            await createCard({ title, notes: note, creatorId: authUser?._id, type: "text" });
            getContent("");
            toast.success("Note created successfully");
            setTitle("");
            setNote("");
            setNoteModel(false);
        } catch (error) {
            toast.error("Failed to create note");
        }
    };

    const handleCancel = () => {
        setNoteModel(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-black">Create Note</h2>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                        Note
                    </label>
                    <textarea
                        id="note"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateNote;