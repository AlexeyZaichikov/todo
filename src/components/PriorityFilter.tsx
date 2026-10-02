import {useCallback} from 'react';
import {
    PRIORITIES,
    PRIORITY_LABELS,
    PriorityFilterValue,
} from '../types/data';

interface IPriorityFilterProps {
    value: PriorityFilterValue;
    onChange: (value: PriorityFilterValue) => void;
    counts: Record<PriorityFilterValue, number>;
}

const ALL_LABEL = 'Все';

const OPTIONS: PriorityFilterValue[] = ['all', ...PRIORITIES];

const PriorityFilter: React.FC<IPriorityFilterProps> = ({value, onChange, counts}) => {
    const handleSelect = useCallback(
        (next: PriorityFilterValue) => () => onChange(next),
        [onChange]
    );

    const getOptionLabel = (option: PriorityFilterValue) =>
        option === 'all' ? ALL_LABEL : PRIORITY_LABELS[option];

    return (
        <div className='filter' role='group' aria-label='Фильтр по приоритету'>
            {OPTIONS.map((option: PriorityFilterValue) => (
                <button
                    key={option}
                    type='button'
                    className={value === option ? 'filter__item filter__item--active' : 'filter__item'}
                    aria-pressed={value === option}
                    onClick={handleSelect(option)}
                >
                    {getOptionLabel(option)} ({counts[option]})
                </button>
            ))}
        </div>
    );
};

export {PriorityFilter};