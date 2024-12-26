const Loading: React.FC = () => {
    return (
        <div className="w-40 h-auto mx-auto flex flex-wrap">
            {Array.from({ length: 16 }).map((_, index) => (
                <div
                    key={index}
                    className={`relative box-border float-left m-2 w-6 h-6 rounded-sm bg-violet-900 animate-wave ${
                        (index + 1) % 4 === 0 ? 'mr-0' : ''
                    }`}
                    style={{
                        animationDelay: `${((index % 4) * 0.2).toFixed(1)}s`,
                    }}
                ></div>
            ))}
        </div>
    );
};

export default Loading;
