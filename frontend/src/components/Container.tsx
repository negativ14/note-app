import { useEffect, useMemo, memo } from "react"
import NoteBox from "./NoteBox"
import { useContentStore } from "../store/useContentStore"
import { Loader2 } from "lucide-react"

// Memoize NoteBox component since it receives multiple props
const MemoizedNoteBox = memo(NoteBox)

const Container = () => {
    const { content, getContent, isContentLoading, activePage } = useContentStore();

    useEffect(() => {
        getContent(""); // Fetch content on component mount or page change
    }, [getContent]);

    // Memoize filtered content to prevent unnecessary recalculations
    const filteredContent = useMemo(() => {
        return activePage === 'home'
            ? content
            : content.filter((card) => card.favourite);
    }, [content, activePage]);

    if (isContentLoading) {
        return (
            <div className="flex justify-center items-center absolute inset-0 z-50">
                <Loader2 size={48} className="animate-spin" />
            </div>
        );
    }

    // Determine which content to display based on the activePage
    // console.log("Cards ka images",content[0].image);

    return (
        <div className="h-auto w-full mb-30">
            <div className="grid grid-cols-4 gap-4 p-4 mt-20">
                {filteredContent.length === 0 ? (
                    <div className="text-center">No content available</div>
                ) : (
                    filteredContent.map((card) => (
                        <MemoizedNoteBox
                            key={card._id}
                            shareLink={card.shareLink}
                            creatorId={card.creatorId}
                            transcript={card.transcript}
                            image={card.image}
                            audio={card.audio}
                            share={card.share}
                            favourite={card.favourite}
                            _id={card._id}
                            title={card.title}
                            date={card.date}
                            notes={card.notes}
                            type={card.type as 'text' | 'audio'}
                        />
                    ))
                )}
            </div>
            <div className="bg-white h-10 w-full mt-20"></div>
        </div>
    );
};

export default memo(Container);
