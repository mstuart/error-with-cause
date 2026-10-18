import test from "ava";
import { isErrorWithCode } from "./index.js";

test("coded native errors match without a serialization method", (t) => {
  const error = Object.assign(new Error("read failed"), { code: "EIO" });
  t.true(isErrorWithCode(error, "EIO"));
  t.is(error.toJSON, undefined);
});
