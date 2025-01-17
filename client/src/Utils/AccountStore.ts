import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AccountType = {
    name: string,
    _id: string,
    todos: TodoType[],
    notes: NoteType[],
    createdAt: string,
    colors: string[],
    categories: {
        todos: string[],
        notes: string[]
    }
}

export type NoteType = {
    _id: string,
    title: string,
    createdAt: string,
    content: string,
    category: string,
    color: string
}

export type TodoType = {
    task: string,
    completed: boolean,
    createdAt: string,
    _id: string,
    desc: string,
    category: string,
    color: string
}

type AccountState = {
    accountInfos: AccountType;
    setAccountInfos: (infos: AccountType) => void,
    addTodoCategory: (newCategory: string) => void,
    deleteTodoCategory: (categoryToDelete: string) => void,
    isSideBarOpen: boolean,
    setIsSideBarOpen: (newState: boolean) => void,
    isSearching: boolean, 
    setIsSearching: (newState: boolean) => void,
    currentCategory: string,
    setCurrentCategory: (newState: string) => void,
    addNoteCategory: (newCategory: string) => void,
    deleteNoteCategory: (categoryToDelete: string) => void,
};

export const useAccountStore = create<AccountState>()(
    persist(
        (set) => ({
            accountInfos: {
                name: '',
                _id: '',
                todos: [],
                notes: [],
                createdAt: '',
                categories: {
                    todos: [],
                    notes: []
                },
                colors: []
            },
            setAccountInfos: (infos) => {
                set({ accountInfos: infos })
            },
            addTodoCategory: (newCategory) => {
                set((prevState) => ({
                  accountInfos: {
                    ...prevState.accountInfos,
                    categories: {
                      ...prevState.accountInfos.categories,
                      todos: [...prevState.accountInfos.categories.todos, newCategory],
                    },
                  },
                }));
            },
            deleteTodoCategory: (categoryToDelete) => {
                set((prevState) => ({
                    accountInfos: {
                        ...prevState.accountInfos,
                        categories: {
                            ...prevState.accountInfos.categories,
                            todos: prevState.accountInfos.categories.todos.filter(
                                (category) => category !== categoryToDelete
                            ),
                        },
                    },
                }));
            },
            isSideBarOpen: true,
            setIsSideBarOpen: (newState) => {
                set({ isSideBarOpen: newState })
            },
            isSearching: false,
            setIsSearching: (newState) => {
                set({ isSearching: newState })
            },
            currentCategory: 'All',
            setCurrentCategory: (newState) => {
                set({ currentCategory: newState })
            },
            addNoteCategory: (newCategory) => {
                set((prevState) => ({
                  accountInfos: {
                    ...prevState.accountInfos,
                    categories: {
                      ...prevState.accountInfos.categories,
                      notes: [...prevState.accountInfos.categories.notes, newCategory],
                    },
                  },
                }));
            },
            deleteNoteCategory: (categoryToDelete) => {
                set((prevState) => ({
                    accountInfos: {
                        ...prevState.accountInfos,
                        categories: {
                            ...prevState.accountInfos.categories,
                            notes: prevState.accountInfos.categories.notes.filter(
                                (category) => category !== categoryToDelete
                            ),
                        },
                    },
                }));
            },
        }),
        {
            name: 'account-storage', // Very important: a unique name
            storage: createJSONStorage(() => sessionStorage), // Or sessionStorage
        }
    )
);