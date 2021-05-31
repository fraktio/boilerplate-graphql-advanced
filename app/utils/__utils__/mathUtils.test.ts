import { mathUtils } from "~/utils/mathUtils";

describe("utils / math", () => {
  it("getRandomArbitrary", async () => {
    const randomNumber = mathUtils.getRandomArbitrary(123, 123);
    expect(randomNumber).toBe(123);
  });

  it("shuffleList", async () => {
    const suffledNumbers = mathUtils.shuffleList([1, 2, 3]);

    expect(suffledNumbers.length).toBe(3);

    expect(suffledNumbers.filter((n) => n === 1)).toHaveLength(1);
    expect(suffledNumbers.filter((n) => n === 2)).toHaveLength(1);
    expect(suffledNumbers.filter((n) => n === 3)).toHaveLength(1);
  });
});
