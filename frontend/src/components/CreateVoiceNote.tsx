import { Disc } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useContentStore } from "../store/useContentStore";
import { toast } from "react-hot-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useReactMediaRecorder } from "react-media-recorder";
import { useAuthStore } from "../store/useAuthStore";
import { memo } from "react";


const CreateVoiceNote = memo(() => {
    const [title, setTitle] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [timer, setTimer] = useState(0);
    const [transcription, setTranscription] = useState("");
    const { voiceNoteModel, setVoiceNoteModel, createCard, uploadAudio, getContent } = useContentStore();
    const { authUser } = useAuthStore();
    const [notes, setNote] = useState("");

    // Set up react-speech-recognition for live transcription.
    const { transcript, resetTranscript } = useSpeechRecognition();

    // Set up react-media-recorder for capturing the audio file.
    const {
        startRecording: startMediaRecording,
        stopRecording: stopMediaRecording,
        mediaBlobUrl,
    } = useReactMediaRecorder({ audio: true });

    // Update our editable transcription as the speech recognition transcript changes.
    useEffect(() => {
        if (isRecording) {
            setTranscription(transcript);
        }
    }, [transcript, isRecording]);

    // Timer effect: increment timer every second while recording.
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    // Auto-stop recording if it exceeds 60 seconds.
    useEffect(() => {
        if (isRecording && timer >= 60) {
            handleStopRecording();
            toast.error("Cannot record more than 1 minute");
        }
    }, [timer, isRecording]);

    if (!voiceNoteModel) return null;

    // Memoize formatTime function since it's used in render
    const formatTime = useMemo(() => (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, []);

    // Memoize handlers using useCallback
    const handleStartRecording = useCallback(() => {
        setIsRecording(true);
        setTimer(0);
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
        startMediaRecording();
    }, [resetTranscript, startMediaRecording]);

    const handleStopRecording = useCallback(() => {
        setIsRecording(false);
        SpeechRecognition.stopListening();
        stopMediaRecording();
    }, [stopMediaRecording]);

    const handleClearRecording = useCallback(() => {
        setIsRecording(false);
        setTimer(0);
        setTranscription("");
        resetTranscript();
    }, [resetTranscript]);

    const handleSave = useCallback(async () => {
        if (!title) {
            return toast.error("Title is required!");
        }

        if (!mediaBlobUrl) {
            return toast.error("No audio recorded!");
        }

        let audioUrl = "";
        if (mediaBlobUrl) {
            const blob = await fetch(mediaBlobUrl).then((res) => res.blob());
            const audioFile = new File([blob], "recording.webm", { type: 'audio/webm' });

            const formData = new FormData();
            formData.append("audio", audioFile);

            audioUrl = await uploadAudio(formData);
        }

        if (audioUrl === "Upload error") {
            toast.error("Audio file did not upload");
            return;
        }

        await createCard({
            title,
            transcript: transcription,
            duration: timer,
            type: "audio",
            audio: audioUrl,
            creatorId: authUser,
            notes: notes
        });

        getContent("");

        toast.success("Audio note created successfully");
        setTitle("");
        setTranscription("");
        setTimer(0);
        setVoiceNoteModel(false);
    }, [title, mediaBlobUrl, transcription, timer, authUser, notes, uploadAudio, createCard, getContent, setVoiceNoteModel]);

    // // Function to convert .webm file to .mp3 using the MediaRecorder API
    // const convertWebmToMp3 = async (webmFile: Blob) => {
    //     return new Promise((resolve, reject) => {
    //         const audioContext = new (window.AudioContext || window.AudioContext)();
    //         const reader = new FileReader();
    //         reader.onload = async (e) => {
    //             try {
    //                 const arrayBuffer = e.target?.result as ArrayBuffer;
    //                 const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    //                 // Create a MediaRecorder to capture the audio output as an MP3
    //                 const mediaStream = audioContext.createMediaStreamDestination();
    //                 const mediaRecorder = new MediaRecorder(mediaStream.stream);
    //                 const chunks: BlobPart[] | undefined = [];

    //                 mediaRecorder.ondataavailable = (event) => {
    //                     chunks.push(event.data);
    //                 };

    //                 mediaRecorder.onstop = () => {
    //                     const mp3Blob = new Blob(chunks, { type: 'audio/mp3' });
    //                     const mp3File = new File([mp3Blob], "converted_audio.mp3", { type: 'audio/mp3' });
    //                     resolve(mp3File);
    //                 };

    //                 // Start recording
    //                 mediaRecorder.start();

    //                 // Start playing the audio so it can be captured by the MediaRecorder
    //                 const source = audioContext.createBufferSource();
    //                 source.buffer = audioBuffer;
    //                 source.connect(mediaStream);
    //                 source.start(0);
    //                 source.onended = () => mediaRecorder.stop();
    //             } catch (err) {
    //                 reject(err);
    //             }
    //         };

    //         reader.onerror = reject;
    //         reader.readAsArrayBuffer(webmFile);
    //     });
    // };



    return (
        <div>
            <div className="fixed inset-0 bg-black/60 z-50"></div>

            <div className="fixed inset-0 flex items-center justify-center z-51">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-black">Start Recording</h2>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        />
                    </div>
                    <div className="mb-4 flex items-center space-x-4">
                        <button
                            onClick={handleStartRecording}
                            disabled={isRecording}
                            className={`w-10 h-10 flex justify-center items-center rounded-full hover: cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400 ${isRecording ? "bg-red-600" : "bg-red-500 hover:bg-red-600"
                                }`}
                        >
                            <Disc size={20} className="animate-pulse text-white" />
                        </button>
                        <button
                            onClick={handleStopRecording}
                            disabled={!isRecording}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md  hover: cursor-pointer hover:bg-gray-300 focus:outline-none"
                        >
                            Stop
                        </button>
                        <button
                            onClick={handleClearRecording}
                            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover: cursor-pointer focus:outline-none"
                        >
                            Clear
                        </button>
                        <div className="text-xl font-mono text-black">{formatTime(timer)}</div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="transcription" className="block text-sm font-medium text-gray-700 mb-1">
                            Transcription
                        </label>
                        <textarea
                            id="transcription"
                            value={transcription}
                            onChange={(e) => setTranscription(e.target.value)}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Voice will be converted to text here..."
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700  mb-1">
                            Note
                        </label>
                        <textarea
                            id="note"
                            value={notes}
                            onChange={(e) => setNote(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none "
                        ></textarea>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setVoiceNoteModel(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover: cursor-pointer hover:bg-gray-300 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover: cursor-pointer focus:outline-none"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CreateVoiceNote;

