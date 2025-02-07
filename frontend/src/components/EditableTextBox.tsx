import { useState, useCallback, useMemo, memo } from "react";
import { useContentStore } from "../store/useContentStore";
import { Button } from "./ui/Button";
import toast from "react-hot-toast";

interface EditableTextBoxProps {
    currentTextButton: string;
}

const EditableTextBox = memo(({ currentTextButton }: EditableTextBoxProps) => {
    const { selectedCard, setSelectedCard, updateCard, getContent } = useContentStore();
    const [note, setNote] = useState(selectedCard.notes || "");
    const [transcript, setTranscript] = useState(selectedCard.transcript || "")

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        currentTextButton === 'Notes' ? setNote(e.target.value) : setTranscript(e.target.value);
    }, [currentTextButton]);

    const handleSave = useCallback(async () => {
        const updatedCard = currentTextButton === 'Notes' 
            ? { ...selectedCard, notes: note } 
            : { ...selectedCard, transcript: transcript };

        setSelectedCard(updatedCard);
        const res = await updateCard(updatedCard);
        if (res) {
            toast.success("Saved successfully!");
            getContent("");
        } else {
            toast.error("Failed to save notes.");
        }
    }, [currentTextButton, note, transcript, selectedCard, setSelectedCard, updateCard, getContent]);

    const handleCopy = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        currentTextButton === 'Notes' 
            ? navigator.clipboard.writeText(note) 
            : navigator.clipboard.writeText(transcript);
        toast.success("Copied to clipboard!")
    }, [currentTextButton, note, transcript]);

    const displayValue = useMemo(() => 
        currentTextButton === 'Notes' ? note : transcript,
    [currentTextButton, note, transcript]);

    const headerText = useMemo(() => 
        currentTextButton === "Notes" ? "Notes" : "Transcript",
    [currentTextButton]);

    return (
        <div className="bg-gray-50 border rounded-xl p-2 px-4 pb-4 border-gray-300">
            <div className="text-gray-900 text-md mb-0.5">{headerText}</div>
            <textarea
                value={displayValue}
                onChange={handleInputChange}
                className="w-full bg-gray-50 text-sm text-gray-500 break-words resize-none focus:outline-none"
                rows={3}
            />
            <div className="mt-2 flex gap-x-2">
                <div onClick={handleSave}><Button variant="purple" size="sm" title="Save" /></div>
                <div onClick={handleCopy}><Button variant="purple" size="sm" title="Copy" /></div>
            </div>
        </div>
    );
});

EditableTextBox.displayName = 'EditableTextBox';

export default EditableTextBox;
