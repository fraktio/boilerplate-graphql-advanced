import { mathUtils } from "../mathUtils";

describe("utils / math", () => {
  it("getRandomArbitrary", async () => {
    const randomNumber = mathUtils.getRandomArbitrary(123, 123);
    expect(randomNumber).toBe(123);
  });

  it("parseStringToNumber, success", async () => {
    const parsed = mathUtils.parseStringToNumber("1234");
    expect(parsed).toMatchObject({ number: 1234 });
  });

  it("parseStringToNumber, failure", async () => {
    const parsed = mathUtils.parseStringToNumber("abcd");
    expect(parsed).toBeNull();
  });

  it("shuffleList", async () => {
    const suffledNumbers = mathUtils.shuffleList([1, 2, 3]);

    expect(suffledNumbers.length).toBe(3);

    expect(suffledNumbers.find((n) => n === 1)).toBe(1);
    expect(suffledNumbers.find((n) => n === 2)).toBe(1);
    expect(suffledNumbers.find((n) => n === 3)).toBe(1);
  });
});
