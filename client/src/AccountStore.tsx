import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AccountType = {
    name: string,
    _id: string,
    todos: TodoType[],
    createdAt: string
}

export type TodoType = {
    task: string,
    completed: boolean
}

type AccountState = {
    accountInfos: AccountType;
    setAccountInfos: (infos: AccountType) => void,
    createTodo: (todo: TodoType) => void
};

export const useAccountStore = create<AccountState>()(
    persist(
        (set) => ({
            accountInfos: {
                name: '',
                _id: '',
                todos: [],
                createdAt: ''
            },
            createTodo: (todo: TodoType) =>
                set((state) => ({
                    accountInfos: {
                        ...state.accountInfos, // Spread the existing accountInfos
                        todos: [...state.accountInfos.todos, todo], // Spread existing todos and add new one
                    },
                })),
            setAccountInfos: (infos: AccountType) => {
                set({ accountInfos: infos })
            }
        }),
        {
            name: 'account-storage', // Very important: a unique name
            storage: createJSONStorage(() => sessionStorage), // Or sessionStorage
        }
    )
);