import {ITodo, isPriority} from '../types/data';

const STORAGE_KEY = 'todos';

const isTodo = (value: unknown): value is ITodo => {
    if (typeof value !== 'object' || value === null) return false;

    const todo = value as Record<string, unknown>;

    return typeof todo.id === 'number'
        && typeof todo.title === 'string'
        && typeof todo.description === 'string'
        && typeof todo.complete === 'boolean'
        && isPriority(todo.priority);
};

/**
 * Возвращает null, если сохранённых задач ещё нет, — вызывающий код
 * решает, чем заменить стартовый список. Пустой массив и «данных нет»
 * это разные состояния, поэтому они намеренно не смешаны.
 */
export const loadTodos = (): ITodo[] | null => {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;

        // Часть записей может прийти битой: отбрасываем их вместо падения,
        // но факт наличия сохранения сохраняем, чтобы не подменять список моками.
        return parsed.filter(isTodo);
    } catch {
        return null;
    }
};

export const saveTodos = (todos: ITodo[]): void => {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
        // хранилище недоступно (приватный режим, переполнение) — молча игнорируем
    }
};

export const clearTodos = (): void => {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
    } catch {
        // см. saveTodos
    }
};