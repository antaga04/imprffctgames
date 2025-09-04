import React, { useState, useEffect } from 'react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';
import { Crown, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFetch } from '@/hooks/useFetch';
import { useTranslation } from 'react-i18next';

const PAGINATED_ITEMS = 5;
const API_GAMES_URL = `${import.meta.env.VITE_API_URL}/games`;

const Ranking: React.FC = () => {
    const { t } = useTranslation();
    const { data: games } = useFetch<GameSchema[]>(API_GAMES_URL);
    const [searchParams, setSearchParams] = useSearchParams();
    const [scores, setScores] = useState<Score[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    const slugToGame = (slug?: string) => {
        if (!slug) return undefined;
        return games?.find((g) => g.slug?.toLowerCase() === slug.toLowerCase());
    };

    const gameSlugParam = searchParams.get('game');
    const pageParam = parseInt(searchParams.get('page') || '1', 10);

    const storageGame = JSON.parse(localStorage.getItem('rankingGame') || '{}');
    const defaultGame = games?.find((game) => game.slug === storageGame.gameSlug) || games?.[1] || undefined;

    const selectedGame = slugToGame(gameSlugParam || '') || defaultGame;
    const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    const isGameValid = !!slugToGame(gameSlugParam || '');
    const isPageValid = !isNaN(pageParam) && pageParam >= 1;

    // Obtener el variant seleccionado del URL o localStorage
    let selectedVariant: GameVariant | undefined;

    if (selectedGame?.variants && selectedGame.variants.length > 0) {
        // Intentar tomar de URL
        const variantParam = searchParams.get('variant');
        if (variantParam) {
            selectedVariant = selectedGame.variants.find((v) => v.label.toString() === variantParam);
        } else {
            // Si no hay en URL, tomar el primer variant por defecto
            selectedVariant = selectedGame.variants[0];
        }
    }

    // Initialize search params if not set or invalid
    useEffect(() => {
        if (games && games.length > 0) {
            if (!gameSlugParam && !searchParams.get('page')) {
                setSearchParams({ game: defaultGame?.slug || '', page: '1' });
            } else if (!isGameValid || !isPageValid) {
                setSearchParams({ game: defaultGame?.slug || '', page: '1' });
            }
        }
        // eslint-disable-next-line
    }, [games]);

    useEffect(() => {
        if (!selectedGame?._id) return; // wait until games are loaded and a game is selected

        const fetchScores = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/scores/${selectedGame._id}`, {
                    params: { page: currentPage, limit: PAGINATED_ITEMS, variant: selectedVariant?.label },
                });

                const { payload } = response.data;

                setScores(payload.paginatedData);
                setPagination(payload.pagination);
            } catch (error) {
                console.error('Error fetching scores:', error);
                const err = error as MyError;
                toast.error(t(`server.${err.response?.data?.i18n}`) || 'An error occurred fetching scores.');
            } finally {
                setIsLoading(false);
            }
        };

        // TODO: add axios call to get games
        fetchScores();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, selectedGame, selectedVariant]);

    const handleGameChange = (value: string) => {
        let gameId: string;
        let variantLabel: string | undefined;

        if (value.includes('-')) {
            const [id, variantStr] = value.split('-');
            gameId = id;
            variantLabel = variantStr;
        } else {
            gameId = value;
            variantLabel = undefined;
        }

        const game = games?.find((g) => g._id === gameId);
        if (!game) return;

        // Guardar en localStorage
        localStorage.setItem('rankingGame', JSON.stringify({ gameSlug: game.slug, variant: variantLabel }));

        // Actualizar URL search params
        const params: Record<string, string> = { game: game.slug || '', page: '1' };
        if (variantLabel !== undefined) params.variant = variantLabel.toString(); // convertir a string
        setSearchParams(params);
    };

    const handlePageChange = (newPage: number) => {
        if (!selectedGame?.slug) return;
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setSearchParams({ game: selectedGame.slug, page: newPage.toString() });
        }
    };

    const scoreKeys = scores[0]
        ? Object.keys(scores[0].scoreData).filter((key) => {
              const value = scores[0].scoreData[key];
              // Include only primitive values and exclude "time"
              return (typeof value === 'string' || typeof value === 'number') && key !== 'variant';
          })
        : [];

    return (
        <div className="flex flex-col text-black mt-32 mb-16">
            <BackButton url="/" />
            <h1 className="text-4xl font-bold text-center text-white neon-text mb-8 capitalize"></h1>
            <div className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-primary">
                        {selectedGame ? (
                            <>
                                <span className="error-underline">{selectedGame.name}</span> {t('globals.ranking')}
                            </>
                        ) : (
                            t('ranking.select_game')
                        )}
                    </h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center justify-between w-[180px] px-3 py-2 border border-gray-300 rounded-md bg-white text-black hover:bg-gray-50">
                                {selectedGame
                                    ? selectedGame.variants && selectedGame.variants.length > 0 && selectedVariant
                                        ? `${selectedGame.name} – ${selectedVariant.label}`
                                        : selectedGame.name
                                    : t('ranking.select_game')}
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-[180px]" align="start">
                            {games?.map((game) => {
                                if (game.variants?.length) {
                                    return (
                                        <DropdownMenuSub key={game._id}>
                                            <DropdownMenuSubTrigger>
                                                {game.name}
                                                {/* Mark top-level game if any variant selected */}
                                                {selectedGame?._id === game._id && selectedVariant && (
                                                    <span className="ml-1 text-sm text-blue-500">✓</span>
                                                )}
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent className="w-[180px]">
                                                {game.variants.map((variant) => (
                                                    <DropdownMenuItem
                                                        key={`${game._id}-${variant.label}`}
                                                        onSelect={() =>
                                                            handleGameChange(`${game._id}-${variant.label}`)
                                                        }
                                                        className={
                                                            selectedGame?._id === game._id &&
                                                            selectedVariant?.label === variant.label
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : ''
                                                        }
                                                    >
                                                        {variant.label}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                    );
                                }

                                return (
                                    <DropdownMenuItem
                                        key={game._id}
                                        onSelect={() => handleGameChange(game._id)}
                                        className={selectedGame?._id === game._id ? 'bg-blue-100 text-blue-700' : ''}
                                    >
                                        {game.name}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {isLoading ? (
                    <div className="py-8 h-[305px] font-mono flex">
                        <p className="text-lg m-auto text-gray-700">{t('globals.loading')}...</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-gray-100">
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>{t('globals.player')}</TableHead>
                                {scoreKeys.map((key) => (
                                    <TableHead key={key} className="capitalize">
                                        {t(`globals.${key}`)}
                                    </TableHead>
                                ))}
                                <TableHead>{t('globals.date')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="h-[265px] overflow-y-auto">
                            {scores.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={scoreKeys.length + 1 + 3}
                                        className="text-center font-mono text-md"
                                    >
                                        {t('ranking.no_scores_available')}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                scores.map((score, index) => (
                                    <TableRow key={score._id}>
                                        <TableCell className="font-medium">
                                            {currentPage === 1 && index === 0 ? (
                                                <Crown className="w-4 h-4 text-amber-500" />
                                            ) : (
                                                (pagination.currentPage - 1) * PAGINATED_ITEMS + index + 1
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center whitespace-nowrap">
                                                <div className="mr-2">
                                                    {score.user_id?.avatar ? (
                                                        <MyAvatar
                                                            url={score.user_id.avatar}
                                                            alt="User Avatar"
                                                            width="w-9"
                                                            height="h-9"
                                                        />
                                                    ) : (
                                                        <span className="w-9 h-9 rounded-full text-white bg-[var(--blue)] flex items-center justify-center">
                                                            {score.user_id?.nickname?.slice(0, 2).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                {score.user_id?.nickname}
                                            </div>
                                        </TableCell>
                                        {scoreKeys.map((key) => (
                                            <TableCell key={key}>{score.scoreData[key]}</TableCell>
                                        ))}
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
                )}

                <div className="mt-4 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    className={pagination.currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}
                                />
                            </PaginationItem>
                            {Array.from({ length: pagination.totalPages }, (_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        isActive={pagination.currentPage === i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={
                                            pagination.currentPage === i + 1 ? 'cursor-not-allowed opacity-50' : ''
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
                {selectedGame && (
                    <p className="flex justify-center mt-4 text-gray-500 text-sm">{selectedGame.info?.ranking}</p>
                )}
            </div>
        </div>
    );
};

export default Ranking;
