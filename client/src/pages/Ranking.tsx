import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import axios from 'axios';
import BackButton from '@/components/ui/BackButton';
import MyAvatar from '@/components/ui/MyAvatar';
import { GAMES } from '@/lib/constants';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

const PAGINATED_ITEMS = 5;

const Ranking: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [scores, setScores] = useState<Score[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    const slugToGame = (slug: string) => GAMES.find((g) => g.gameName.toLowerCase() === slug.toLowerCase());

    const gameSlugParam = searchParams.get('game');
    const pageParam = parseInt(searchParams.get('page') || '1', 10);

    const storageGameId = localStorage.getItem('rankingGame');
    const defaultGame = GAMES.find((game) => game.gameName === storageGameId) || GAMES[0];

    const selectedGame = slugToGame(gameSlugParam || '') || defaultGame;
    const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const isGameValid = !!slugToGame(gameSlugParam || '');
    const isPageValid = !isNaN(pageParam) && pageParam >= 1;

    useEffect(() => {
        const fetchScores = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/scores/${selectedGame.gameId}`, {
                    params: { page: currentPage, limit: PAGINATED_ITEMS },
                });

                setScores(response.data.data);
                setPagination(response.data.pagination);
            } catch (error) {
                const err = error as MyError;
                toast.error(err.response?.data?.error || 'An error occurred fetching scores.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchScores();
    }, [selectedGame.gameId, currentPage]);

    // Initialize search params if not set or invalid
    useEffect(() => {
        if (!gameSlugParam && !searchParams.get('page')) {
            setSearchParams({ game: defaultGame.gameName, page: '1' });
        } else if (!isGameValid || !isPageValid) {
            setSearchParams({ game: defaultGame.gameName, page: '1' });
        }
        // eslint-disable-next-line
    }, []);

    const handleGameChange = (gameId: string) => {
        const game = GAMES.find((g) => g.gameId === gameId);
        if (game) {
            localStorage.setItem('rankingGame', game.gameName);
            setSearchParams({ game: game.gameName, page: '1' });
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setSearchParams({ game: selectedGame.gameName, page: newPage.toString() });
        }
    };

    return (
        <div className="flex flex-col text-black mt-32 mb-16">
            <BackButton url="/" />
            <h1 className="text-4xl font-bold text-center text-white neon-text mb-8">Leaderboard</h1>
            <div className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-primary">
                        {selectedGame ? (
                            <>
                                <span className="error-underline">{selectedGame.gameName}</span> Ranking
                            </>
                        ) : (
                            'Select a Game'
                        )}
                    </h2>
                    <Select onValueChange={handleGameChange} value={selectedGame?.gameId || ''}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a game" />
                        </SelectTrigger>
                        <SelectContent>
                            {GAMES.map((game) => (
                                <SelectItem key={game.gameId} value={game.gameId}>
                                    {game.gameName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {selectedGame ? (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Rank</TableHead>
                                    <TableHead>Player</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center font-mono text-md">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : scores.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center font-mono text-md">
                                            No scores available
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    scores.map((score, index) => (
                                        <TableRow key={score._id}>
                                            <TableCell className="font-medium text-center">
                                                {(pagination.currentPage - 1) * PAGINATED_ITEMS + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center whitespace-nowrap">
                                                    <div className="mr-2">
                                                        {score.user_id.avatar ? (
                                                            <MyAvatar
                                                                url={score.user_id.avatar}
                                                                alt="User Avatar"
                                                                width="w-9"
                                                                height="h-9"
                                                            />
                                                        ) : (
                                                            <span className="w-9 h-9 rounded-full text-white bg-[var(--blue)] flex items-center justify-center">
                                                                {score.user_id.nickname.slice(0, 2).toUpperCase()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {score.user_id.nickname}
                                                </div>
                                            </TableCell>
                                            <TableCell className="">
                                                {score.game_id._id === import.meta.env.VITE_POKEMON_ID ? (
                                                    `${score.scoreData.correct}/${score.scoreData.total}`
                                                ) : (
                                                    <span className="flex flex-wrap items-baseline md:gap-1">
                                                        <span className="text-base whitespace-nowrap">
                                                            Time: {score.scoreData.time}s
                                                        </span>
                                                        <span className="text-xs whitespace-nowrap text-black/70">
                                                            {' '}
                                                            ({score.scoreData.moves} moves)
                                                        </span>
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {new Date(score.updatedAt).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <div className="mt-4 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            className={
                                                pagination.currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                                            }
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                                        <PaginationItem key={i}>
                                            <PaginationLink
                                                isActive={pagination.currentPage === i + 1}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={
                                                    pagination.currentPage === i + 1
                                                        ? 'cursor-not-allowed opacity-50'
                                                        : ''
                                                }
                                            >
                                                {i + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            className={
                                                pagination.currentPage === pagination.totalPages
                                                    ? 'cursor-not-allowed opacity-50'
                                                    : ''
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                        {selectedGame?.gameId === import.meta.env.VITE_PUZZLE15_ID ? (
                            <p className="flex justify-center mt-4 text-gray-500 text-sm">
                                Ranking is based on faster times. Fewer moves are the tiebreaker.
                            </p>
                        ) : (
                            <p className="flex justify-center mt-4 text-gray-500 text-sm">
                                Ranking is based on a combination of total correct guesses and accuracy.
                            </p>
                        )}
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-lg mb-4">Please select a game to view its leaderboard.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ranking;
