interface ToggleButtonProps<T extends string> {
    label: string;
    value: T;
    selectedValue: T;
    onClick: () => void;
    disabled?: boolean;
    size?: 'xs' | 'sm';
}

export default function ToggleButton<T extends string>({
    label,
    value,
    selectedValue,
    onClick,
    disabled = false,
    size = 'sm',
}: ToggleButtonProps<T>) {
    const baseClasses =
        'px-4 py-2 rounded-md font-mono transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeClasses = size === 'xs' ? 'text-xs' : 'text-sm';

    const activeClasses = 'bg-green-500 text-white hover:bg-green-600 border border-green-600';
    const inactiveClasses = 'bg-transparent border border-green-500 text-green-300 hover:bg-green-700';

    return (
        <button
            className={`${baseClasses} ${sizeClasses} ${selectedValue === value ? activeClasses : inactiveClasses}`}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
}
