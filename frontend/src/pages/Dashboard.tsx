import { useCallback, useState, useMemo } from 'react';
import { memo } from 'react';
import Container from '../components/Container'
import Sidebar from '../components/Sidebar'
import SearchBar from '../components/SearchBar';
import { useDebouncedCallback } from 'use-debounce';
import { useContentStore } from '../store/useContentStore';
import NoteModel from '../components/NoteModel';
import FloatingActionButton from '../components/FloatingActionButton';
import CreateNote from '../components/CreateNote';
import CreateVoiceNote from '../components/CreateVoiceNote';

const SearchBarMemo = memo(SearchBar);
const SidebarMemo = memo(Sidebar);
const ContainerMemo = memo(Container);
const FloatingActionButtonMemo = memo(FloatingActionButton);
const CreateNoteMemo = memo(CreateNote);
const CreateVoiceNoteMemo = memo(CreateVoiceNote);
const NoteModelMemo = memo(NoteModel);

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { getContent, openModel, noteModel, voiceNoteModel } = useContentStore();

  const debouncedGetContent = useDebouncedCallback((term) => {
    getContent(term);
  }, 500);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedGetContent(value);
  }, [debouncedGetContent]);

  // Add memoization for the main content section
  const mainContent = useMemo(() => (
    <div className="flex h-screen w-screen overflow-x-hidden">
      <div className="w-1/6 fixed top-0 left-0 h-screen bg-gray-800 text-white">
        <SidebarMemo />
      </div>
      <SearchBarMemo searchTerm={searchTerm} onSearch={handleSearch} />
      <div className="w-5/6 ml-64">
        <ContainerMemo />
      </div>
      <FloatingActionButtonMemo />
    </div>
  ), [searchTerm, handleSearch]);

  return (
    <>
      {openModel && <NoteModelMemo />}
      {noteModel && <CreateNoteMemo />}
      {voiceNoteModel && <CreateVoiceNoteMemo />}
      {mainContent}
    </>
  )
}

export default memo(Dashboard);