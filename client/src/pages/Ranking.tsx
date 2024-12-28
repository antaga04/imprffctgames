import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Game, PaginationInfo, Score } from '@/types/types';

const games: Game[] = [
    { gameId: '676f12b831fbdf3e1d79b16a', gameName: 'Pokemon' },
    { gameId: '676f137d31fbdf3e1d79b172', gameName: '15 Puzzle' },
];

const Ranking: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [scores, setScores] = useState<Score[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchScores = async (gameId: string, page: number) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/scores/${gameId}`, {
                params: { page, limit: 10 },
            });

            setScores(response.data.data);
            setPagination(response.data.pagination);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (selectedGame) {
            fetchScores(selectedGame.gameId, 1);
        }
    }, [selectedGame]);

    const handleGameChange = (gameId: string) => {
        const game = games.find((g) => g.gameId === gameId);
        if (game) {
            setSelectedGame(game);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (selectedGame && newPage >= 1 && newPage <= pagination.totalPages) {
            fetchScores(selectedGame.gameId, newPage);
        }
    };

    return (
        <div className="flex flex-col text-black md:mt-40 mt-32">
            <BackButton />
            <h1 className="text-4xl font-bold text-center text-white neon-text mb-8">Leaderboard</h1>
            <div className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-primary">
                        {selectedGame ? `${selectedGame.gameName} Rankings` : 'Select a Game'}
                    </h2>
                    <Select onValueChange={handleGameChange} value={selectedGame?.gameId || ''}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a game" />
                        </SelectTrigger>
                        <SelectContent>
                            {games.map((game) => (
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
                                    <TableHead className="w-[100px]">Rank</TableHead>
                                    <TableHead>Player</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : scores.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center">
                                            No scores available
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    scores.map((score, index) => (
                                        <TableRow key={score._id}>
                                            <TableCell className="font-medium">
                                                {(pagination.currentPage - 1) * 10 + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Avatar className="w-8 h-8 mr-2">
                                                        <AvatarImage
                                                            src={score.user_id.avatar}
                                                            alt={score.user_id.nickname}
                                                        />
                                                        <AvatarFallback>
                                                            {score.user_id.nickname.slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {score.user_id.nickname}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-left">
                                                {new Date(score.createdAt).toLocaleString(undefined, {
                                                    dateStyle: 'medium',
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {score.game_id.name === 'pokemon'
                                                    ? `${score.scoreData.correct}/${score.scoreData.total}`
                                                    : `Moves: ${score.scoreData.moves}, Time: ${score.scoreData.time}s`}
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
