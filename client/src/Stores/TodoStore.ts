import { create } from 'zustand';
import { TodoType } from './AccountStore'

type newTodoType = {
    task: string,
    desc: string,
    category: string,
    color: string
}

type CreateTodoType = {
    isCreateOpen: boolean,
    setIsCreateOpen: (newState: boolean) => void,
    newTodo: newTodoType,
    setNewTodo: (newState: newTodoType) => void,
    capitalize: (str: string) => string
};

export const useCreateTodoStore = create<CreateTodoType>((set) => ({ 
    isCreateOpen: false,
    setIsCreateOpen: (newState: boolean) => set({ isCreateOpen: newState }),
    newTodo: {
        task: '',
        desc: '',
        category: 'All',
        color: 'default'
    },
    setNewTodo: (newState: newTodoType) => set({ newTodo: newState }),
    capitalize: (str: string) => {return str[0].toUpperCase() + str.slice(1)}
}));

type EditTodoType = {
    isEditOpen: boolean,
    setIsEditOpen: (newState: boolean) => void,
    currentTodo: TodoType,
    setCurrentTodo: (newTodo: TodoType) => void
};

export const useEditTodoStore = create<EditTodoType>((set) => ({ 
    isEditOpen: false,
    setIsEditOpen: (newState: boolean) => set({ isEditOpen: newState }),
    currentTodo: {
        task: '',
        completed: false,
        createdAt: '',
        category: '',
        _id: '',
        desc: '',
        color: ''
    },
    setCurrentTodo: (newTodo: TodoType) => set({ currentTodo: newTodo })
}));

type TodoCategoryType = {
    isCategoryFormOpen: boolean,
    setIsCategoryFormOpen: (newState: boolean) => void
}

export const useTodoCategoryStore = create<TodoCategoryType>((set) => ({ 
    isCategoryFormOpen: false,
    setIsCategoryFormOpen: (newState: boolean) => set({ isCategoryFormOpen: newState })
}));