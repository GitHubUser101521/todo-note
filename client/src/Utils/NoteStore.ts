import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { NoteType } from './AccountStore'

type NoteStoreType = {
    isNoteOpen: boolean,
    setIsNoteOpen: (newState: boolean) => void,
    currentNote: NoteType,
    setCurrentNote: (newState: NoteType) => void,
    convertToDate: (timestamp: string) => string,
}

export const useNoteStore = create<NoteStoreType>()(
    persist(
        (set) => ({
            isNoteOpen: false,
            setIsNoteOpen: (newState: boolean) => set({ isNoteOpen: newState }),
            currentNote: {
                title: '',
                createdAt: '',
                content: '',
                _id: '',
            },
            setCurrentNote: (newState) => set({ currentNote: newState }),
            convertToDate: (timestamp: string) => {
                try {
                    const date = new Date(Number(timestamp));
                    return date.toLocaleString();
                } catch (error) {
                    console.error("Invalid timestamp:", timestamp, error);
                    return "Invalid Date"; // Or handle the error as needed
                }
            },
        }),
        {
            name: 'note-storage', 
        }
    )
);