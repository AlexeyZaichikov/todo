import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {App} from './App';
import {clearTodos} from '../utils/storage';

const getTodoTitles = () =>
    screen
        .getAllByRole('listitem')
        .map(item => item.querySelector('.todo__title')?.textContent);

const createTodo = (title: string, priorityLabel: string) => {
    userEvent.click(screen.getByRole('button', {name: 'Добавить задачу'}));
    userEvent.type(screen.getByLabelText('Название'), title);
    userEvent.type(screen.getByLabelText('Описание'), 'Описание задачи');
    userEvent.click(screen.getByRole('radio', {name: priorityLabel}));
    userEvent.click(screen.getByRole('button', {name: 'Создать'}));
};

describe('App', () => {
    beforeEach(() => {
        clearTodos();
    });

    it('показывает моковые задачи при первом запуске', () => {
        render(<App />);

        expect(screen.getAllByRole('listitem')).toHaveLength(6);
    });

    it('фильтрует список по приоритету', () => {
        render(<App />);

        userEvent.click(screen.getByRole('button', {name: /Высокий \(3\)/}));

        expect(getTodoTitles()).toEqual([
            'Подготовить тестовое задание',
            'Добавить фильтр по приоритету',
            'Сделать создание через модалку',
        ]);
    });

    it('возвращает полный список по фильтру «Все»', () => {
        render(<App />);

        userEvent.click(screen.getByRole('button', {name: /Низкий/}));
        expect(screen.getAllByRole('listitem')).toHaveLength(2);

        userEvent.click(screen.getByRole('button', {name: /Все/}));
        expect(screen.getAllByRole('listitem')).toHaveLength(6);
    });

    it('добавляет задачу через модалку и пересчитывает счётчик', () => {
        render(<App />);

        createTodo('Новая задача', 'Высокий');

        expect(screen.getByRole('button', {name: /Высокий \(4\)/})).toBeInTheDocument();
        expect(getTodoTitles()).toContain('Новая задача');
    });

    it('показывает новую задачу в активном фильтре', () => {
        render(<App />);

        userEvent.click(screen.getByRole('button', {name: /Высокий \(3\)/}));
        createTodo('Высокая задача', 'Высокий');

        expect(getTodoTitles()).toContain('Высокая задача');
    });

    it('не добавляет задачу, если форма невалидна', () => {
        render(<App />);

        userEvent.click(screen.getByRole('button', {name: 'Добавить задачу'}));
        userEvent.click(screen.getByRole('button', {name: 'Создать'}));

        expect(screen.getByText('Введите название')).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(6);
    });

    it('показывает пустое состояние, если фильтр ничего не нашёл', () => {
        render(<App />);

        userEvent.click(screen.getByRole('button', {name: /Низкий/}));
        for (const title of [
            'Настроить сохранение в localStorage',
            'Написать README',
        ]) {
            userEvent.click(screen.getByRole('button', {name: `Удалить: ${title}`}));
        }

        expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
        expect(screen.getByText('Нет задач с таким приоритетом')).toBeInTheDocument();
    });

    it('переключает выполнение задачи', () => {
        render(<App />);

        // первый мок уже выполнен, поэтому переключаем незавершённый
        const secondItem = screen.getAllByRole('listitem')[1];
        expect(within(secondItem).getByRole('checkbox')).not.toBeChecked();

        userEvent.click(within(secondItem).getByRole('checkbox'));

        expect(
            within(screen.getAllByRole('listitem')[1]).getByRole('checkbox')
        ).toBeChecked();
    });

    it('удаляет задачу', () => {
        render(<App />);

        userEvent.click(
            screen.getByRole('button', {name: 'Удалить: Подготовить тестовое задание'})
        );

        expect(getTodoTitles()).not.toContain('Подготовить тестовое задание');
        expect(screen.getAllByRole('listitem')).toHaveLength(5);
    });

    it('сбрасывает список к мокам', () => {
        render(<App />);

        userEvent.click(
            screen.getByRole('button', {name: 'Удалить: Подготовить тестовое задание'})
        );
        expect(screen.getAllByRole('listitem')).toHaveLength(5);

        userEvent.click(screen.getByRole('button', {name: 'Сбросить к мокам'}));

        expect(screen.getAllByRole('listitem')).toHaveLength(6);
        expect(getTodoTitles()).toContain('Подготовить тестовое задание');
    });
});