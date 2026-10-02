import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TodoFormModal} from './TodoFormModal';

const setup = () => {
    const onSubmit = jest.fn();
    const onClose = jest.fn();

    render(<TodoFormModal onSubmit={onSubmit} onClose={onClose} />);

    return {onSubmit, onClose};
};

const fillRequiredFields = () => {
    userEvent.type(screen.getByLabelText('Название'), 'Тестовая задача');
    userEvent.type(screen.getByLabelText('Описание'), 'Тестовое описание');
};

describe('TodoFormModal', () => {
    it('фокусирует поле названия при открытии', () => {
        setup();

        expect(screen.getByLabelText('Название')).toHaveFocus();
    });

    it('не отправляет пустую форму и показывает ошибки', () => {
        const {onSubmit} = setup();

        userEvent.click(screen.getByRole('button', {name: 'Создать'}));

        expect(onSubmit).not.toHaveBeenCalled();
        expect(screen.getByText('Введите название')).toBeInTheDocument();
        expect(screen.getByText('Введите описание')).toBeInTheDocument();
    });

    it('не считает пробелы заполнением', () => {
        const {onSubmit} = setup();

        userEvent.type(screen.getByLabelText('Название'), '   ');
        userEvent.type(screen.getByLabelText('Описание'), '   ');
        userEvent.click(screen.getByRole('button', {name: 'Создать'}));

        expect(onSubmit).not.toHaveBeenCalled();
    });

    it('не показывает ошибки до первой попытки отправки', () => {
        setup();

        expect(screen.queryByText('Введите название')).not.toBeInTheDocument();
    });

    it('снимает ошибку, когда поле исправлено', () => {
        const {onSubmit} = setup();

        userEvent.click(screen.getByRole('button', {name: 'Создать'}));
        expect(screen.getByText('Введите название')).toBeInTheDocument();

        fillRequiredFields();
        userEvent.click(screen.getByRole('button', {name: 'Создать'}));

        expect(screen.queryByText('Введите название')).not.toBeInTheDocument();
        expect(onSubmit).toHaveBeenCalled();
    });

    it('отправляет черновик с выбранным приоритетом и закрывается', () => {
        const {onSubmit, onClose} = setup();

        fillRequiredFields();
        userEvent.click(screen.getByRole('radio', {name: 'Высокий'}));
        userEvent.click(screen.getByRole('button', {name: 'Создать'}));

        expect(onSubmit).toHaveBeenCalledWith({
            title: 'Тестовая задача',
            description: 'Тестовое описание',
            priority: 'high',
        });
        expect(onClose).toHaveBeenCalled();
    });

    it('закрывается по Escape', () => {
        const {onClose} = setup();

        userEvent.keyboard('{esc}');

        expect(onClose).toHaveBeenCalled();
    });

    it('не закрывается по клику внутри окна', () => {
        const {onClose} = setup();

        userEvent.click(screen.getByRole('heading', {name: 'Новая задача'}));

        expect(onClose).not.toHaveBeenCalled();
    });

    it('закрывается по кнопке «Отмена» без отправки', () => {
        const {onSubmit, onClose} = setup();

        userEvent.click(screen.getByRole('button', {name: 'Отмена'}));

        expect(onSubmit).not.toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it('блокирует прокрутку страницы, пока открыта', () => {
        const {unmount} = render(
            <TodoFormModal onSubmit={jest.fn()} onClose={jest.fn()} />
        );

        expect(document.body.style.overflow).toBe('hidden');

        unmount();
        expect(document.body.style.overflow).not.toBe('hidden');
    });
});