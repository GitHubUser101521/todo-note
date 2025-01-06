import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AccountType = {
    name: string,
    _id: string,
    todos: TodoType[],
    createdAt: string,
    colors: string[],
    categories: {
        todos: string[],
        notes: string[]
    }
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
    deleteTodoCategory: (categoryToDelete: string) => void
};

export const useAccountStore = create<AccountState>()(
    persist(
        (set) => ({
            accountInfos: {
                name: '',
                _id: '',
                todos: [],
                createdAt: '',
                categories: {
                    todos: [],
                    notes: []
                },
                colors: []
            },
            setAccountInfos: (infos: AccountType) => {
                set({ accountInfos: infos })
            },
            addTodoCategory: (newCategory: string) => {
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
            deleteTodoCategory: (categoryToDelete: string) => {
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
        }),
        {
            name: 'account-storage', // Very important: a unique name
            storage: createJSONStorage(() => sessionStorage), // Or sessionStorage
        }
    )
);