import {ITodo} from '../types/data';

/**
 * Первичные данные для первого запуска: бэкенда нет, поэтому список
 * должен быть непустым уже при монтировании. Порядок и приоритеты
 * подобраны так, чтобы фильтр и toggle были видны сразу.
 */
export const mockTodos: ITodo[] = [
    {
        id: 1,
        title: 'Сделать тестовое',
        description: 'Посмотреть требования, выполнить, отправить результат',
        priority: 'high',
        complete: true,
    },
    {
        id: 2,
        title: 'Покормить кота',
        description: 'Купить корм и насыпать в миску',
        priority: 'medium',
        complete: false,
    },
    {
        id: 3,
        title: 'Приготовить ужин',
        description: 'Котлетки с макарошками, нет, с пюрешкой',
        priority: 'low',
        complete: false,
    },
    {
        id: 4,
        title: 'Купить продукты',
        description: 'Корм, котлетки, картошка',
        priority: 'high',
        complete: false,
    },
    {
        id: 5,
        title: 'Ответить клиенту',
        description: 'Уточнить требования, скинуть промежуточные результаты',
        priority: 'high',
        complete: false,
    },
    {
        id: 6,
        title: 'Посмотреть фильм',
        description: 'Хоррор или приключения',
        priority: 'low',
        complete: false,
    },
];