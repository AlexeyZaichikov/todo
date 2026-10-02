export const PRIORITIES = ['low', 'medium', 'high'] as const;

export type Priority = (typeof PRIORITIES)[number];

export type PriorityFilterValue = Priority | 'all';

export interface ITodo {
    id: number;
    title: string;
    description: string;
    priority: Priority;
    complete: boolean;
}

export interface ITodoDraft {
    title: string;
    description: string;
    priority: Priority;
}

export const PRIORITY_LABELS: Record<Priority, string> = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий',
};

export const isPriority = (value: unknown): value is Priority =>
    (PRIORITIES as readonly unknown[]).includes(value);