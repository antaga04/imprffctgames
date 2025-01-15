const ButtonForm: React.FC<{ text: string }> = ({ text }) => {
    return (
        <button
            id="login-btn"
            type="submit"
            className="transition-colors duration-200 border ring-1 ring-black bg-[#6795df] hover:bg-[#4b6a9d] text-white px-4 py-2 rounded-md cursor-pointer"
        >
            {text}
        </button>
    );
};

export default ButtonForm;
