import { MdOutlineCloseFullscreen } from "react-icons/md";
import { useContentStore } from "../store/useContentStore";
import { IconButton } from "./ui/IconButton";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { Button } from "./ui/Button";
import toast from "react-hot-toast";
import { FaAlignLeft } from "react-icons/fa";
import { SlNote } from "react-icons/sl";
import { BsLayers } from "react-icons/bs";
import { RiSpeakAiFill } from "react-icons/ri";
import { useState } from "react";
import ImageUploader from "./ImageUploader";
import EditableTextBox from "./EditableTextBox";

const AudioPlayer = ({ audio }: { audio: string }) => (
    <div className="flex items-center gap-3 p-1.5 border border-gray-500 rounded-4xl bg-gray-100">
        <audio controls className="w-full h-4">
            <source src={audio} type="audio/webm" />
            Your browser does not support the audio element.
        </audio>
        <a
            href={`${audio}?fl_attachment`}
            download
            className="bg-black flex justify-center items-center text-sm text-white px-4 py-2 rounded-3xl hover:bg-gray-700"
        >
            Download
        </a>
    </div>
);


const NoteModel = () => {
    const { setOpenModel, selectedCard, setSelectedCard, updateCard, getContent } = useContentStore();
    const [currentTextButton, setCurrentTextButton] = useState("Notes");
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleClose = () => {
        setOpenModel(false);
    };

    const toggleFullScreen = () => {
        setIsFullScreen((prev) => !prev);
    };

    const formattedDate = new Date(selectedCard.date).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    const handleFavourite = () => {
        const updatedFavouriteStatus = !selectedCard.favourite;

        setSelectedCard({
            ...selectedCard,
            favourite: updatedFavouriteStatus,
        });

        getContent("");

        if (updatedFavouriteStatus) {
            toast.success("Added to Favourite");
        } else {
            toast.error("Removed from Favourite");
        }

        updateCard({ ...selectedCard, favourite: updatedFavouriteStatus });
    };

    const setTextButton = (button: string) => {
        setCurrentTextButton(button);
    };

    return (
        <div>
            <div className="w-screen h-screen bg-black opacity-60 fixed left-0 top-0 z-100"></div>

            <div className="w-full h-full fixed flex justify-center items-center left-0 top-0 z-101" onClick={handleClose}>
                <div
                    className={`bg-white rounded-lg shadow-md overflow-auto transition-all ${isFullScreen ? "w-screen h-screen p-12" : "h-[500px] w-[800px]"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col justify-start p-8 gap-y-4">
                        <div className="flex justify-between items-center">
                            <div onClick={toggleFullScreen} className="cursor-pointer">
                                <IconButton variant="simple" icon={MdOutlineCloseFullscreen} />
                            </div>

                            <div className="flex justify-between items-center gap-x-2">
                                <div onClick={handleFavourite}>
                                    <IconButton variant="simple" icon={selectedCard.favourite ? IoHeartSharp : IoHeartOutline} />
                                </div>
                                <div>
                                    <Button variant="simple" size="sm" title="share" />
                                </div>
                                <div onClick={handleClose}>
                                    <IconButton variant="simple" icon={RxCross2} />
                                </div>
                            </div>
                        </div>

                        {/* title */}
                        <div>
                            <div className="font-semibold text-xl">{selectedCard.title}</div>
                            <div className="text-sm text-gray-500">{formattedDate}</div>
                        </div>

                        {/* audio */}
                        {selectedCard.audio && <AudioPlayer audio={selectedCard.audio} />}

                        {/* buttons notes or transcript */}
                        <div className="flex gap-x-2">
                            <div onClick={() => setTextButton("Notes")}>
                                <Button variant="simple" size="sm" icon={SlNote} title="Notes" />
                            </div>
                            {selectedCard.type === "audio" && (
                                <div onClick={() => setTextButton("Transcript")}>
                                    <Button variant="simple" size="sm" icon={FaAlignLeft} title="Transcript" />
                                </div>
                            )}
                            <Button variant="simple" size="sm" icon={BsLayers} title="Create" />
                            <Button variant="simple" size="sm" icon={RiSpeakAiFill} title="Speaker transcript" />
                        </div>

                        <EditableTextBox currentTextButton={currentTextButton} />

                        <div className="text-md font-semibold">Upload image</div>

                        {selectedCard.image && selectedCard.image.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {selectedCard.image?.filter((imageLink: string) => imageLink)
                                    .map((imageLink: string, index: number) => (
                                        <img
                                            key={index}
                                            src={imageLink}
                                            alt="Card image"
                                            className="h-[70px] w-[70px] object-cover rounded border border-gray-300"
                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                        />
                                    ))}
                        
                                <ImageUploader />
                            </div>
                        )}

                        {selectedCard.image.length === 0 && <ImageUploader />}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteModel;
