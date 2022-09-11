import { sum } from "./example-lib";
test("sum works", () => {
  expect(sum(10, 20)).toEqual(30);
});
