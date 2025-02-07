import type React from "react"
import { useState, useEffect, useRef, useCallback, memo } from "react"
import { MdSettingsVoice } from "react-icons/md"
import { BiSolidNotepad } from 'react-icons/bi'
import { useContentStore } from "../store/useContentStore"

const FloatingActionButton: React.FC = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { setNoteModel, setVoiceNoteModel } = useContentStore();

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const handleNoteClick = useCallback(() => {
    setNoteModel(true)
  }, [setNoteModel])

  const handleVoiceNoteClick = useCallback(() => {
    setVoiceNoteModel(true)
  }, [setVoiceNoteModel])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed bottom-18 right-25">
      <div className="relative">
        {isOpen && (
          <>
            <button
              className="absolute bottom-14 right-0 w-12 h-12 rounded-full bg-purple-400 text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover: cursor-pointer hover:bg-purple-500 transform hover:scale-110"
              onClick={handleNoteClick}
            >
              <BiSolidNotepad />
            </button>
            <button
              className="absolute bottom-28 right-0 w-12 h-12 rounded-full bg-red-400 text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover: cursor-pointer hover:bg-red-500 transform hover:scale-110"
              onClick={handleVoiceNoteClick}
            >
              <MdSettingsVoice />
            </button>
          </>
        )}
        <button
          className="w-12 h-12 rounded-full bg-gray-300 text-gray-900 text-2xl flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover: cursor-pointer hover:bg-gray-400 transform hover:scale-110"
          onClick={toggleOpen}
        >
          {isOpen ? "×" : "+"}
        </button>
      </div>
    </div>
  )
})

FloatingActionButton.displayName = 'FloatingActionButton'

export default FloatingActionButton
