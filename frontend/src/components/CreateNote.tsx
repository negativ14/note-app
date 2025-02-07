import { useState, useCallback, memo } from "react"
import { useContentStore } from "../store/useContentStore"
import { useAuthStore } from "../store/useAuthStore"
import toast from "react-hot-toast"

const CreateNote = memo(() => {
    const [title, setTitle] = useState("")
    const [notes, setNote] = useState("")

    const { noteModel, setNoteModel, createCard, getContent } = useContentStore()
    const { authUser } = useAuthStore();

    if (!noteModel) return null

    const handleSave = useCallback(async () => {
        if(!title || !notes){
            return toast.error("Fill the both fields");
        }
        await createCard({title, notes, creatorId: authUser?._id, type: 'text'})
        getContent("");
        toast.success("Note created successfully")
        setTitle("")
        setNote("")
        setNoteModel(false);
    }, [title, notes, authUser?._id, createCard, getContent, setNoteModel]);

    const handleCancel = useCallback(() => {
        setNoteModel(false)
    }, [setNoteModel]);

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }, []);

    const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(e.target.value)
    }, []);

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white  p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-black ">Create Note</h2>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700  mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="note" className="block text-sm font-medium text-gray-700  mb-1">
                        Note
                    </label>
                    <textarea
                        id="note"
                        value={notes}
                        onChange={handleNoteChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover: cursor-pointer hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 "
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover: cursor-pointer focus:outline-none "
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
})

export default CreateNote

