import {useCallback, useEffect, useState} from 'react';
import {mockTodos} from '../data/mockTodos';
import {ITodo, ITodoDraft} from '../types/data';
import {clearTodos, loadTodos, saveTodos} from '../utils/storage';

export interface IUseTodos {
    todos: ITodo[];
    addTodo: (draft: ITodoDraft) => void;
    deleteTodo: (id: number) => void;
    toggleTodo: (id: number) => void;
    resetToMocks: () => void;
}

const getInitialTodos = (): ITodo[] => loadTodos() ?? mockTodos;

export const useTodos = (): IUseTodos => {
    const [todos, setTodos] = useState<ITodo[]>(getInitialTodos);

    useEffect(() => {
        saveTodos(todos);
    }, [todos]);

    const addTodo = useCallback((draft: ITodoDraft): void => {
        const {title, description, priority} = draft;

        setTodos(prev => [
            ...prev,
            {
                id: prev.reduce((max, todo) => Math.max(max, todo.id), 0) + 1,
                title: title.trim(),
                description: description.trim(),
                priority,
                complete: false,
            },
        ]);
    }, []);

    const deleteTodo = useCallback((id: number): void => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
    }, []);

    const toggleTodo = useCallback((id: number): void => {
        setTodos(prev => prev.map(todo =>
            todo.id === id ? {...todo, complete: !todo.complete} : todo
        ));
    }, []);

    const resetToMocks = useCallback((): void => {
        clearTodos();
        setTodos(mockTodos);
    }, []);

    return {todos, addTodo, deleteTodo, toggleTodo, resetToMocks};
};