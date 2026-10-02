import {useCallback, useEffect, useRef, useState} from 'react';
import {
    ITodoDraft,
    PRIORITIES,
    PRIORITY_LABELS,
    Priority,
} from '../types/data';

interface ITodoFormModalProps {
    onSubmit: (draft: ITodoDraft) => void;
    onClose: () => void;
}

type FieldErrors = Partial<Record<'title' | 'description', string>>;

const MAX_TITLE_LENGTH = 100;

const validate = (draft: ITodoDraft): FieldErrors => {
    const errors: FieldErrors = {};

    if (!draft.title.trim()) errors.title = 'Введите название';
    else if (draft.title.trim().length > MAX_TITLE_LENGTH)
        errors.title = `Не больше ${MAX_TITLE_LENGTH} символов`;

    if (!draft.description.trim()) errors.description = 'Введите описание';

    return errors;
};

const EMPTY_DRAFT: ITodoDraft = {
    title: '',
    description: '',
    priority: 'medium',
};

const TodoFormModal: React.FC<ITodoFormModalProps> = ({onSubmit, onClose}) => {
    const [draft, setDraft] = useState<ITodoDraft>(EMPTY_DRAFT);
    const [submitted, setSubmitted] = useState(false);

    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        titleInputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const patchDraft = useCallback(
        <K extends keyof ITodoDraft>(key: K, value: ITodoDraft[K]) => {
            setDraft(prev => ({...prev, [key]: value}));
        },
        []
    );

    const liveErrors = validate(draft);
    const visibleErrors = submitted ? liveErrors : {};

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitted(true);

        if (Object.keys(liveErrors).length > 0) return;

        onSubmit(draft);
        onClose();
    };

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) onClose();
    };

    return (
        <div className='modal-backdrop' onClick={handleBackdropClick}>
            <div
                className='modal'
                role='dialog'
                aria-modal='true'
                aria-labelledby='todo-modal-title'
            >
                <h2 id='todo-modal-title'>Новая задача</h2>

                <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor='todo-title'>Название</label>
                    <input
                        id='todo-title'
                        ref={titleInputRef}
                        value={draft.title}
                        onChange={event => patchDraft('title', event.target.value)}
                        aria-invalid={Boolean(visibleErrors.title)}
                        aria-describedby={visibleErrors.title ? 'todo-title-error' : undefined}
                    />
                    {visibleErrors.title && (
                        <span id='todo-title-error' className='field-error' role='alert'>
                            {visibleErrors.title}
                        </span>
                    )}

                    <label htmlFor='todo-description'>Описание</label>
                    <textarea
                        id='todo-description'
                        value={draft.description}
                        onChange={event => patchDraft('description', event.target.value)}
                        aria-invalid={Boolean(visibleErrors.description)}
                        aria-describedby={
                            visibleErrors.description ? 'todo-description-error' : undefined
                        }
                    />
                    {visibleErrors.description && (
                        <span
                            id='todo-description-error'
                            className='field-error'
                            role='alert'
                        >
                            {visibleErrors.description}
                        </span>
                    )}

                    <fieldset>
                        <legend>Приоритет</legend>
                        {PRIORITIES.map((priority: Priority) => (
                            <label key={priority} className='priority-option'>
                                <input
                                    type='radio'
                                    name='priority'
                                    value={priority}
                                    checked={draft.priority === priority}
                                    onChange={() => patchDraft('priority', priority)}
                                />
                                {PRIORITY_LABELS[priority]}
                            </label>
                        ))}
                    </fieldset>

                    <div className='modal-actions'>
                        <button type='button' onClick={onClose}>
                            Отмена
                        </button>
                        <button type='submit'>Создать</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export {TodoFormModal};