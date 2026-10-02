import {memo} from 'react';
import {ITodo} from '../types/data';
import {TodoItem} from './TodoItem';

interface ITodoListProps {
    items: ITodo[];
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
    isFiltered: boolean;
}

const TodoList: React.FC<ITodoListProps> = memo(({items, onDelete, onToggle, isFiltered}) => {
    if (items.length === 0) {
        return (
            <p className='empty'>
                {isFiltered
                    ? 'Нет задач с таким приоритетом'
                    : 'Список пуст, добавьте первую задачу'}
            </p>
        );
    }

    return (
        <ul className='todo-list'>
            {items.map(todo => (
                <TodoItem
                    key={todo.id}
                    {...todo}
                    onDelete={onDelete}
                    onToggle={onToggle}
                />
            ))}
        </ul>
    );
});

TodoList.displayName = 'TodoList';

export {TodoList};