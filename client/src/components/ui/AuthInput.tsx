import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const AuthInput: React.FC<AuthInputProps> = ({
    label,
    name,
    type,
    placeholder,
    Icon,
    value,
    onChange,
    disabled,
    focusOnMount,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="form-field">
            <label htmlFor={name} className="block font-medium text-gray-700">
                {label}
            </label>
            <div className="relative flex items-center">
                <input
                    id={name}
                    name={name}
                    type={type === 'password' && showPassword ? 'text' : type}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${disabled && 'cursor-not-allowed'} p-2 pl-10 pr-12 rounded-md border text-sm w-full`}
                    ref={focusOnMount}
                />
                <Icon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                {type === 'password' && (
                    <button
                        type="button"
                        title={showPassword ? 'Hide password' : 'Show password'}
                        onClick={handleTogglePassword}
                        className="flex items-center text-sm leading-5 text-gray-400 hover:bg-black/5 border w-[38px] h-[38px] rounded-md justify-center ml-2 transition-all duration-300"
                    >
                        {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AuthInput;
