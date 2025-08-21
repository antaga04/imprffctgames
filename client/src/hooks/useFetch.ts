import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export const useFetch = <T>(url: string, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(url);
            setData(response.data.payload);
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            const err = error as MyError;
            toast.error(err.response?.data?.message || 'Error fetching data.');
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        if (autoFetch) fetchData();
    }, [fetchData, autoFetch]);

    return { data, loading, fetchData };
};
