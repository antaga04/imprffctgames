/**
 * Paginate data based on the given page and limit.
 * @param {Array} data - Array of data to paginate.
 * @param {number} page - Current page number.
 * @param {number} limit - Number of items per page.
 * @returns {Object} - Paginated data and pagination metadata.
 */
export const paginate = (data, page, limit) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = data.slice(startIndex, endIndex);

    const pagination = {
        totalItems: data.length,
        currentPage: Number(page),
        totalPages: Math.ceil(data.length / limit),
        hasNextPage: endIndex < data.length,
        hasPreviousPage: startIndex > 0,
    };

    return { paginatedData, pagination };
};
