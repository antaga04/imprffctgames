import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, CircleCheck, CircleX, CircleMinus } from 'lucide-react';
import { getValidationSchema, validate, validateConfirmPassword } from '@/lib/validate';

const ValidationContainer: React.FC<ValidationContainerProps> = ({ heading, rules, renderIcon }) => (
    <div className="absolute z-10 mt-1 w-full max-w-md bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-700 bottom-full left-0">
        <h4 className="mb-2 font-semibold">{heading}</h4>
        <ul className="space-y-1">
            {rules.map((r, idx) => (
                <li key={idx} className="flex items-start gap-2">
                    {renderIcon(r.message)}
                    <span>{r.message}</span>
                </li>
            ))}
        </ul>
    </div>
);

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
    originalPassword,
    activeValidation = false,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [showValidation, setShowValidation] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const { heading, rules } = getValidationSchema(name, originalPassword);

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleFocus = () => {
        setShowValidation(true);
    };

    const handleBlur = () => {
        setShowValidation(false);
    };

    useEffect(() => {
        if (!activeValidation) return;
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            if (name === 'nickname') {
                setValidationErrors(validate(value, 'nickname').errors);
            } else if (name === 'password') {
                setValidationErrors(validate(value, 'password').errors);
            } else if (name === 'newPassword') {
                setValidationErrors(validate(value, 'newPassword').errors);
            } else if (name === 'confirmPassword') {
                setValidationErrors(validateConfirmPassword(originalPassword ?? '', value));
            } else if (name === 'email') {
                setValidationErrors(validate(value, 'email').errors);
            } else {
                setValidationErrors([]);
            }
        }, 300);
        return () => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [value, name, originalPassword, activeValidation]);

    const renderIcon = (error: string) => {
        if (value === '') return <CircleMinus className="flex-shrink-0 w-4 h-4 text-gray-400" />;
        return validationErrors.includes(error) ? (
            <CircleX className="flex-shrink-0 w-4 h-4 text-red-500" />
        ) : (
            <CircleCheck className="flex-shrink-0 w-4 h-4 text-green-500" />
        );
    };

    const borderColorClass =
        activeValidation &&
        (value === '' ? 'border-gray-300' : validationErrors.length > 0 ? 'border-red-500' : 'border-green-500');

    return (
        <div className="form-field relative">
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
                    className={`${disabled ? 'cursor-not-allowed' : ''} p-2 pl-10 pr-12 rounded-md border text-sm w-full ${borderColorClass}`}
                    ref={focusOnMount}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <Icon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                {type === 'password' && (
                    <button
                        type="button"
                        title={showPassword ? 'Hide password' : 'Show password'}
                        onClick={handleTogglePassword}
                        className="flex items-center text-sm leading-5 text-gray-400 hover:bg-black/5 border w-[38px] h-[38px] rounded-md justify-center ml-2 transition-all duration-300"
                        // tabIndex={-1}
                    >
                        {showPassword ? <Eye /> : <EyeOff />}
                    </button>
                )}
            </div>
            {showValidation && activeValidation && (
                <ValidationContainer heading={heading} rules={rules} renderIcon={renderIcon} />
            )}
        </div>
    );
};

export default AuthInput;
