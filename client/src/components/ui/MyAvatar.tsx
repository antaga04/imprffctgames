const MyAvatar: React.FC<MyAvatarProps> = ({ url, alt, width, height }) => {
    return (
        <span className={`${width} ${height} rounded-full flex items-center justify-center overflow-hidden`}>
            <img src={url} alt={alt} className={`object-cover ${height}`} />
        </span>
    );
};

export default MyAvatar;
