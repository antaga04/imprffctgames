import { useState } from 'react';

const CoolDownButton: React.FC<CoolDownButtonProps> = ({
    onSubmit,
    text,
    bgColor = 'bg-blue-600',
    hoverBgColor = 'hover:bg-blue-700',
    textColor = 'text-white',
    className,
    coolTime = 1000,
    title,
}) => {
    const [cooldown, setCooldown] = useState<boolean>(false);

    const handleOnSubmit = () => {
        if (!cooldown) {
            onSubmit();
            setCooldown(true);
            setTimeout(() => setCooldown(false), coolTime);
        }
    };

    return (
        <button
            title={title}
            onClick={handleOnSubmit}
            disabled={cooldown}
            className={`px-4 py-2 rounded ${
                cooldown ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed' : bgColor
            } ${hoverBgColor} ${textColor} ${className ?? ''}`}
        >
            {text}
        </button>
    );
};

export default CoolDownButton;
