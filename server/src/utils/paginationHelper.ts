export const paginate = (data: any[], page: string, limit: string) => {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;

    const paginatedData = data.slice(startIndex, endIndex);

    const pagination = {
        totalItems: data.length,
        currentPage: pageNumber,
        totalPages: Math.ceil(data.length / limitNumber),
        hasNextPage: endIndex < data.length,
        hasPreviousPage: startIndex > 0,
    };

    return { paginatedData, pagination };
};
