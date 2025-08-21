const ButtonForm: React.FC<{ text: string; disabled?: boolean }> = ({ text, disabled }) => {
    return (
        <button
            id="login-btn"
            type="submit"
            className={`${disabled ? 'cursor-not-allowed bg-slate-600' : 'cursor-pointer bg-[#6795df] hover:bg-[#4b6a9d]'} transition-colors duration-200 border ring-1 ring-black text-white px-4 py-2 rounded-md`}
            disabled={disabled}
        >
            {text}
        </button>
    );
};

export default ButtonForm;
