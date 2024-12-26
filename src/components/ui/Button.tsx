type ButtonProps = {
    text: string;
};

const Button: React.FC<ButtonProps> = ({ text }) => {
    return (
        <button
            id="login-btn"
            type="submit"
            className="transition-colors duration-200 border outline outline-1 outline-black bg-[#6795df] hover:bg-[#4b6a9d] text-white px-4 py-2 rounded-md cursor-pointer"
        >
            {text}
        </button>
    );
};

export default Button;
