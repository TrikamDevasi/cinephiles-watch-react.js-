import { create } from "zustand";
import { persist } from "zustand/middleware";

const useWatchlistStore = create(
    persist(
        (set, get) => ({
            watchlist: [],

            addToWatchlist: (movie) => {
                const { watchlist } = get();
                if (!watchlist.find((m) => m.id === movie.id)) {
                    set({ watchlist: [...watchlist, { ...movie, addedAt: Date.now() }] });
                }
            },

            removeFromWatchlist: (movieId) => {
                const { watchlist } = get();
                set({
                    watchlist: watchlist.filter((m) => m.id !== movieId),
                });
            },

            isInWatchlist: (movieId) => {
                return get().watchlist.some((m) => m.id === movieId);
            },
        }),
        {
            name: "cinephiles-watchlist",
        }
    )
);

export default useWatchlistStore;
