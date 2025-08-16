import { Link } from 'react-router-dom';

const GameItem: React.FC<GameItemProps> = ({ link, name, thumbnail }) => {
    return (
        <li className="md:h-56 w-full outline outline-1 outline-[#f2f2f20d] outline-offset-[-1px] bg-[#f2f2f20a] rounded-[24px] self-stretch p-2 relative shadow-[0_40px_80px_#00000080]">
            <div className="glare-item-top outer-edge"></div>
            <Link
                to={`/games/${link}`}
                id={link}
                className="card p-4 justify-start w-full h-full flex gap-4 sm:justify-center items-center md:flex-col bg-[linear-gradient(190deg,#cddbe2b5,#7886949c)] border border-[#d0d0d059] hover:border-[#d3d3d3] rounded-[16px] no-underline transition-[border] duration-300 ease-custom-ease-1 relative overflow-hidden"
            >
                <div className="glare-item-top inner-edge"></div>
                <img loading="lazy" src={thumbnail} alt={`${name} logo`} className="w-10 h-10 md:w-16 md:h-16 z-10" />
                <p className="text-2xl font-bold text-white z-10 text-center">{name}</p>
                <div className="card-bg"></div>
            </Link>
        </li>
    );
};

export default GameItem;
