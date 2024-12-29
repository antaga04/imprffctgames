import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type AuthInputProps = {
    label: string;
    name: string;
    type: string;
    placeholder: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isPassword?: boolean;
};

const AuthInput: React.FC<AuthInputProps> = ({ label, name, type, placeholder, Icon, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="form-field">
            <label htmlFor={name} className="block font-medium text-gray-700">
                {label}
            </label>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={type === 'password' && showPassword ? 'text' : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="p-2 pl-10 pr-12 rounded-md border text-sm w-full"
                />
                <Icon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={handleTogglePassword}
                        className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AuthInput;
