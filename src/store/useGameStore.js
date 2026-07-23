import { create } from "zustand";

/**
 * useGameStore — global game/UI state.
 * Skeleton only: screen + mode switching and placeholder player stats.
 * TODO(cowork): wire real save/load, combat resolution, inventory,
 * narrative-card progression, etc. per actual game logic.
 */
const useGameStore = create((set) => ({
    screen: "landing", // 'landing' | 'gameview'
    mode: "adventure", // 'adventure' | 'combat'

    player: {
        body: 10,
        defense: 10,
        determination: 8,
        stamina: 3,
    },

    goToLanding: () => set({ screen: "landing" }),
    startNewGame: () => set({ screen: "gameview", mode: "adventure" }),
    continueGame: () => set({ screen: "gameview" }),
    setMode: (mode) => set({ mode }),
}));

export default useGameStore;
