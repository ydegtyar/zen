import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { uniq } from 'lodash';
import { queryClient } from '@/data/query-client';

const FAVORITES_KEY = 'favorites';
const FAVORITES_QUERY_KEY = ['favorites'];

export async function getFavorites(): Promise<number[]> {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
}

export async function setFavorites(favorites: number[]) {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

const flushFavoritesToStorage = () => {
    const favorites = queryClient.getQueryData<number[]>(FAVORITES_QUERY_KEY);
    setFavorites(favorites ?? []);
};

export function useFavorites() {
    return useQuery<number[]>({
        queryKey: FAVORITES_QUERY_KEY,
        queryFn: getFavorites,
        staleTime: Infinity,
    });
}

export function addFavorite(index: number) {
    queryClient.setQueryData<number[]>(FAVORITES_QUERY_KEY, prev => prev ? uniq([...prev, index]) : [index]);
    flushFavoritesToStorage();
}

export function removeFavorite(index: number) {
    queryClient.setQueryData<number[]>(FAVORITES_QUERY_KEY, prev => prev ? prev.filter(i => i !== index) : []);
    flushFavoritesToStorage();
}

export function useFavoritesCount() {
    const { data = [] } = useFavorites();
    return data.length;
}

export function useIsFavorite(index?: number) {
    const { data = [] } = useFavorites();
    return index ? data.includes(index) : false;
}
