import assert from "node:assert/strict";
import test from "node:test";
import { cancellationDemoReducer, createInitialDemoState } from "./demoState.js";

test("test_AC_06_DRAFT_05_cancellation_boundaries", async (t) => {
  await t.test("44 นาทีแสดงหน้าจอยกเลิกไม่ได้", () => {
    const state = {
      ...createInitialDemoState(),
      minutesRemaining: 44,
    };

    assert.equal(
      cancellationDemoReducer(state, { type: "request-cancellation" }).screen,
      "not-allowed"
    );
  });

  for (const minutesRemaining of [45, 119]) {
    await t.test(`${minutesRemaining} นาทีต้องยืนยันก่อนดูผล`, () => {
      const state = {
        ...createInitialDemoState(),
        minutesRemaining,
      };
      const warning = cancellationDemoReducer(state, { type: "request-cancellation" });

      assert.equal(warning.screen, "confirmation");
      assert.equal(warning.confirmed, false);
      assert.equal(cancellationDemoReducer(warning, { type: "confirm-demo" }).screen, "result");
    });
  }

  await t.test("120 นาทีแสดงตัวอย่างผลโดยไม่ยืนยันหรือทำธุรกรรม", () => {
    const state = {
      ...createInitialDemoState(),
      minutesRemaining: 120,
    };
    const result = cancellationDemoReducer(state, { type: "request-cancellation" });

    assert.equal(result.screen, "result");
    assert.equal(result.confirmed, false);
  });
});
