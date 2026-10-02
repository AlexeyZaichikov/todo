import {memo} from 'react';
import {ITodo, PRIORITY_LABELS} from '../types/data';

type ITodoItemProps = ITodo & {
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
};

const TodoItem: React.FC<ITodoItemProps> = memo(({id, title, description, priority, complete, onDelete, onToggle}) => {
    const handleToggle = () => onToggle(id);
    const handleDelete = () => onDelete(id);

    return (
        <li className={complete ? 'todo todo--done' : 'todo'}>
            <input
                type='checkbox'
                checked={complete}
                onChange={handleToggle}
                aria-label={`Отметить выполненной: ${title}`}
            />

            <div className='todo__body'>
                <div className='todo__title'>{title}</div>
                <div className='todo__description'>{description}</div>
            </div>

            <span className={`todo__priority todo__priority--${priority}`}>
                {PRIORITY_LABELS[priority]}
            </span>

            <button type='button' onClick={handleDelete} aria-label={`Удалить: ${title}`}>
                ×
            </button>
        </li>
    );
});

TodoItem.displayName = 'TodoItem';

export {TodoItem};