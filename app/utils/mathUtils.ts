export const mathUtils = {
  // min: Incluside, max: Inclusive
  getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
  },

  parseStringToNumber(number: string) {
    const parsed = parseInt(number);

    return isNaN(parsed) ? null : { number: parsed };
  },

  shuffleList<T>(items: T[]): T[] {
    return items.sort(() => 0.5 - Math.random());
  },
};
