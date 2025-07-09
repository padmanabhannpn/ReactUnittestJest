import { sum } from "../sum"

test('add 1 + 2 to equal to 3',() => {
    expect(sum(1,2)).toBe(3)
});

test('add -1 + 1 to equal to 0',() => {
    expect(sum(-1,1)).toBe(0)
});
