/**
 * Paginate data based on the given page and limit.
 * @param {Array} data - Array of data to paginate.
 * @param {number} page - Current page number.
 * @param {number} limit - Number of items per page.
 * @returns {Object} - Paginated data and pagination metadata.
 */
export const paginate = (data, page, limit) => {
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
