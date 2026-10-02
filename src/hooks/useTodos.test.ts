import {renderHook, act} from '@testing-library/react';
import {mockTodos} from '../data/mockTodos';
import {useTodos} from './useTodos';
import {clearTodos} from '../utils/storage';

describe('useTodos', () => {
    beforeEach(() => {
        clearTodos();
    });

    it('берёт моки, если в хранилище ничего нет', () => {
        const {result} = renderHook(() => useTodos());

        expect(result.current.todos).toEqual(mockTodos);
    });

    it('читает сохранённые задачи вместо моков', () => {
        const saved = [{id: 42, title: 'Из хранилища', description: 'd', priority: 'low' as const, complete: false}];
        window.localStorage.setItem('todos', JSON.stringify(saved));

        const {result} = renderHook(() => useTodos());

        expect(result.current.todos).toEqual(saved);
    });

    it('добавляет задачу и обрезает пробелы', () => {
        const {result} = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo({
                title: '  Новая  ',
                description: '  описание  ',
                priority: 'high',
            });
        });

        const added = result.current.todos[result.current.todos.length - 1];
        expect(added).toMatchObject({
            title: 'Новая',
            description: 'описание',
            priority: 'high',
            complete: false,
        });
        expect(result.current.todos).toHaveLength(mockTodos.length + 1);
    });

    it('выдаёт id строго больше максимального существующего', () => {
        const {result} = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo({title: 'a', description: 'b', priority: 'low'});
            result.current.addTodo({title: 'c', description: 'd', priority: 'low'});
        });

        const ids = result.current.todos.map(todo => todo.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('переключает выполнение, не мутируя исходный объект', () => {
        const {result} = renderHook(() => useTodos());
        const target = result.current.todos[0];
        const snapshot = {...target};

        act(() => {
            result.current.toggleTodo(target.id);
        });

        expect(target).toEqual(snapshot);
        expect(result.current.todos[0].complete).toBe(!snapshot.complete);
    });

    it('удаляет задачу по id', () => {
        const {result} = renderHook(() => useTodos());
        const target = result.current.todos[1];

        act(() => {
            result.current.deleteTodo(target.id);
        });

        expect(result.current.todos).toHaveLength(mockTodos.length - 1);
        expect(result.current.todos.find(todo => todo.id === target.id)).toBeUndefined();
    });

    it('возвращает моки по resetToMocks', () => {
        const {result} = renderHook(() => useTodos());

        act(() => {
            result.current.deleteTodo(result.current.todos[0].id);
        });
        expect(result.current.todos).toHaveLength(mockTodos.length - 1);

        act(() => {
            result.current.resetToMocks();
        });

        expect(result.current.todos).toEqual(mockTodos);
    });

    it('сохраняет изменения в localStorage', () => {
        const {result} = renderHook(() => useTodos());

        act(() => {
            result.current.addTodo({title: 'сохр', description: 'ация', priority: 'low'});
        });

        const raw = window.localStorage.getItem('todos');
        expect(raw).not.toBeNull();
        expect(JSON.parse(raw as string)).toEqual(result.current.todos);
    });

    it('не падает на битых данных в хранилище', () => {
        window.localStorage.setItem('todos', '{"not":"an array"}');

        const {result} = renderHook(() => useTodos());

        expect(result.current.todos).toEqual(mockTodos);
    });
});