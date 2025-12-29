import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Transaction, Insight } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${BASE_URL}/transactions`;

export const useTransactions = () => {
    return useQuery<Transaction[]>({
        queryKey: ['transactions'],
        queryFn: async () => (await axios.get(API_URL)).data
    });
};

export const useInsights = () => {
    return useMutation<Insight>({
        mutationFn: async () => (await axios.get(`${API_URL}/analyze`)).data
    });
};

export const useUploadCSV = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => axios.post(`${API_URL}/upload`, formData),
        onSuccess: () => {
            // Invalidate cache to trigger re-fetch
            setTimeout(() => queryClient.invalidateQueries({ queryKey: ['transactions'] }), 1000);
        },
    });
};