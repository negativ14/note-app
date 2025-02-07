import React, { useMemo, useCallback } from 'react';
import { FiFileText, FiPlus } from 'react-icons/fi';
import { MdContentCopy, MdAudiotrack, MdDelete } from 'react-icons/md';
import { Button } from "./ui/Button";
import { IconButton } from "./ui/IconButton";
import { useContentStore } from '../store/useContentStore';
import toast from 'react-hot-toast';
import mongoose from 'mongoose';

interface NoteBoxProps {
  title: string;
  date: Date;
  notes: string;
  type: 'text' | 'audio';
  _id: string;
  shareLink: string;
  creatorId: mongoose.Types.ObjectId;
  transcript: string;
  share: boolean;
  image: string[];
  audio: string;
  favourite: boolean;
}

const NoteBox: React.FC<NoteBoxProps> = React.memo(({ title, date, notes, type, _id, transcript, shareLink, share, image, audio, favourite }: NoteBoxProps) => {
  const { deleteCard, getContent, setOpenModel } = useContentStore();
  const setSelectedCard = useContentStore((state) => state.setSelectedCard);

  // Memoize date parsing and formatting
  const { parsedDate, isValidDate, formattedDate } = useMemo(() => {
    const parsed = new Date(date);
    const valid = !isNaN(parsed.getTime());
    const formatted = valid
      ? parsed.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : 'Invalid date';
    return { parsedDate: parsed, isValidDate: valid, formattedDate: formatted };
  }, [date]);

  // Memoize event handlers
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setOpenModel(true);
    setSelectedCard({ _id, title, date, notes, type, shareLink, share, image, audio, favourite, transcript });
  }, [_id, title, date, notes, type, shareLink, share, image, audio, favourite, transcript, setOpenModel, setSelectedCard]);

  const handleDelete = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    await deleteCard(_id);
    getContent("");
    toast.success("Deleted card successfully");
  }, [_id, deleteCard, getContent]);

  const handleCopy = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(notes);
    toast.success("Copied to clipboard!");
  }, [notes]);

  return (
    <article onClick={handleClick} className="h-80 w-72 flex flex-col justify-between bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:scale-1.5 hover: cursor-pointer hover:shadow-lg transition-shadow">
      {/* Header Section */}
      <header className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <time
            className="text-xs text-gray-500"
            dateTime={isValidDate ? parsedDate.toISOString() : ''}
          >
            {formattedDate}
          </time>
          <Button
            size="sm"
            variant="simple"
            title={type === 'text' ? 'Text' : 'Audio'}
            icon={type === 'text' ? FiFileText : MdAudiotrack}
          >
          </Button>
        </div>

        <h3 className="text-md font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>
      </header>

      {/* Content Section */}
      <div className='flex-1 w-60'>
        <p className="w-full text-sm text-gray-600 mt-2 mb-4 tracking-wide break-words line-clamp-7">
          {notes}
        </p>
      </div>


      {/* Action Buttons */}
      <footer className="flex justify-end gap-1.5">
        <div onClick={handleDelete}> <IconButton variant="simple" icon={MdDelete} /> </div>
        <div onClick={handleCopy}> <IconButton variant="simple" icon={MdContentCopy} /> </div>
        <IconButton variant="simple" icon={FiPlus} />
      </footer>
    </article>
  );
});

export default NoteBox;