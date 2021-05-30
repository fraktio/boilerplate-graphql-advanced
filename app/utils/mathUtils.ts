export const mathUtils = {
  // min: Incluside, max: Inclusive
  getRandomArbitrary(min: number, max: number): number {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  },

  shuffleList<T>(items: T[]): T[] {
    return items.sort(() => 0.5 - Math.random());
  },
};
