import {useCallback, useMemo, useState} from 'react';
import {PriorityFilterValue} from '../types/data';
import {PriorityFilter} from './PriorityFilter';
import {TodoFormModal} from './TodoFormModal';
import {TodoList} from './TodoList';
import {useTodos} from '../hooks/useTodos';

const getEmptyCounts = (): Record<PriorityFilterValue, number> => ({
    all: 0,
    low: 0,
    medium: 0,
    high: 0,
});

const App: React.FC = () => {
    const {todos, addTodo, deleteTodo, toggleTodo, resetToMocks} = useTodos();
    const [filter, setFilter] = useState<PriorityFilterValue>('all');
    const [isModalOpen, setModalOpen] = useState(false);

    const visibleTodos = useMemo(
        () => (filter === 'all' ? todos : todos.filter(todo => todo.priority === filter)),
        [todos, filter]
    );

    const counts = useMemo(() => {
        const next = getEmptyCounts();
        next.all = todos.length;

        for (const todo of todos) {
            next[todo.priority] += 1;
        }

        return next;
    }, [todos]);

    const openModal = useCallback(() => setModalOpen(true), []);
    const closeModal = useCallback(() => setModalOpen(false), []);

    return (
        <div className='app'>
            <header className='app__header'>
                <h1>Задачи</h1>
                <div className='app__actions'>
                    <button type='button' onClick={openModal}>
                        Добавить задачу
                    </button>
                    <button type='button' className='secondary' onClick={resetToMocks}>
                        Сбросить к мокам
                    </button>
                </div>
            </header>

            <PriorityFilter value={filter} onChange={setFilter} counts={counts} />

            <TodoList
                items={visibleTodos}
                onDelete={deleteTodo}
                onToggle={toggleTodo}
                isFiltered={filter !== 'all'}
            />

            {isModalOpen && <TodoFormModal onSubmit={addTodo} onClose={closeModal} />}
        </div>
    );
};

export {App};