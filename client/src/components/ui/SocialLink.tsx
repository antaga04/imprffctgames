import { MoveUpRight } from 'lucide-react';

const SocialLink: React.FC<SocialLinkProps> = ({ name, link }) => {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between gap-2 group md:px-3 md:py-1 rounded-lg md:bg-[#f2f2f20f] md:hover:bg-[#f2f2f233] md:border md:border-[#f2f2f20a] md:hover:border-[#f2f2f21a] md:backdrop-blur-md md:transition-all md:duration-400 ease-custom-ease-1"
        >
            {name}
            <span className="fill-white inline-block transform transition-transform duration-300 ease-custom-ease-2 group-hover:-rotate-[-45deg]">
                <MoveUpRight className="h-4 w-4" />
            </span>
        </a>
    );
};

export default SocialLink;
