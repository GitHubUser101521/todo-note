import { create } from 'zustand';
import { TodoType } from './AccountStore'

type newTodoType = {
    task: string,
    desc: string,
    category: string,
    color: string
}

type TodoStoreType = {

    // CREATE

    isCreateOpen: boolean,
    setIsCreateOpen: (newState: boolean) => void,
    newTodo: newTodoType,
    setNewTodo: (newState: newTodoType) => void,
    capitalize: (str: string) => string,

    // EDIT

    isEditOpen: boolean,
    setIsEditOpen: (newState: boolean) => void,
    currentTodo: TodoType,
    setCurrentTodo: (newTodo: TodoType) => void,

    // CATEGORY

    isCategoryFormOpen: boolean,
    setIsCategoryFormOpen: (newState: boolean) => void
};

const useTodoStore = create<TodoStoreType>((set) => ({ 

    // CREATE

    isCreateOpen: false,
    setIsCreateOpen: (newState: boolean) => set({ isCreateOpen: newState }),
    newTodo: {
        task: '',
        desc: '',
        category: 'All',
        color: 'default'
    },
    setNewTodo: (newState: newTodoType) => set({ newTodo: newState }),
    capitalize: (str: string) => {return str[0].toUpperCase() + str.slice(1)},

    // EDIT

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
    setCurrentTodo: (newTodo: TodoType) => set({ currentTodo: newTodo }),

    // CATEGORY

    isCategoryFormOpen: false,
    setIsCategoryFormOpen: (newState: boolean) => set({ isCategoryFormOpen: newState })
}));


export default useTodoStore