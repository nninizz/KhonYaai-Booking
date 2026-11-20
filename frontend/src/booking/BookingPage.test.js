import test from "node:test";
import assert from "node:assert/strict";

import {
  createMockQuote,
  createQuoteSignature,
  findMockPlace,
  getMockPlaces,
  isQuoteFresh,
  readCurrentLocation,
  validateMockBookingState,
  createMockBookingSuccess,
  buildBookingRequest,
  retryPaymentBookingId,
} from "../api.js";

test("AC-03-11 select place returns name address and coordinates", () => {
  const places = getMockPlaces();
  assert.deepEqual(findMockPlace(places, 1), {
    id: 1,
    name: "สยามพารากอน",
    address: "สยามพารากอน กรุงเทพฯ",
    lat: 13.7462,
    lng: 100.5347,
  });
  assert.deepEqual(findMockPlace(places, 2), {
    id: 2,
    name: "เซ็นทรัลเวิลด์",
    address: "เซ็นทรัลเวิลด์ กรุงเทพฯ",
    lat: 13.7466,
    lng: 100.5393,
  });
});

test("AC-03-12 current location becomes pickup", async () => {
  const result = await readCurrentLocation({
    getCurrentPosition(success) {
      success({ coords: { latitude: 13.7462, longitude: 100.5347 } });
    },
  });
  assert.deepEqual(result, {
    name: "ตำแหน่งปัจจุบัน",
    address: "ตำแหน่งปัจจุบัน",
    lat: 13.7462,
    lng: 100.5347,
  });
});

test("AC-03-13 failed current location provides fallback rejection", async () => {
  await assert.rejects(
    readCurrentLocation({
      getCurrentPosition(_success, failure) {
        failure(new Error("denied"));
      },
    }),
    /location-failed/,
  );
});

test("AC-03-02 mock quote returns amounts only", () => {
  const pickup = { address: "สยามพารากอน", lat: 13.7462, lng: 100.5347 };
  const dropoff = { address: "เซ็นทรัลเวิลด์", lat: 13.7466, lng: 100.5393 };
  assert.deepEqual(createMockQuote(pickup, dropoff), {
    distance_km: 0.5,
    total_price: 5,
    deposit_amount: 2,
    remaining_amount: 3,
  });
});

test("AC-03-03 quote freshness is cleared after form change", () => {
  const pickup = { address: "สยามพารากอน", lat: 13.7462, lng: 100.5347 };
  const dropoff = { address: "เซ็นทรัลเวิลด์", lat: 13.7466, lng: 100.5393 };
  const oldSignature = createQuoteSignature("2026-11-20T16:00", pickup, dropoff, "MEDIUM");
  const newSignature = createQuoteSignature("2026-11-20T16:00", pickup, dropoff, "LARGE");
  assert.equal(isQuoteFresh(oldSignature, oldSignature), true);
  assert.equal(isQuoteFresh(newSignature, oldSignature), false);
  assert.equal(isQuoteFresh("", oldSignature), false);
});

test("AC-03-05 missing booking fields returns incomplete error", () => {
  assert.equal(validateMockBookingState("", null, null, ""), "กรอกข้อมูลไม่ครบ");
});

test("AC-03-06 mock booking success keeps one booking id and amounts", () => {
  const quote = {
    distance_km: 12.3,
    total_price: 123,
    deposit_amount: 37,
    remaining_amount: 86,
  };
  assert.deepEqual(createMockBookingSuccess(quote), {
    id: 101,
    status: "PENDING_DEPOSIT",
    ...quote,
  });
});

test("AC-03-14 zero deposit is rejected by mock quote", () => {
  const pickup = { address: "จุดแรก", lat: 13.7462, lng: 100.5347 };
  const dropoff = { address: "จุดใกล้", lat: 13.7462, lng: 100.5348 };
  assert.throws(
    () => createMockQuote(pickup, dropoff),
    /ระยะใกล้เกินไป|จุดรับและจุดส่งต้องอยู่คนละที่/,
  );
});

test("T-12 booking request uses real contract fields without amounts", () => {
  const pickup = { address: "สยามพารากอน", lat: 13.7462, lng: 100.5347 };
  const dropoff = { address: "เซ็นทรัลเวิลด์", lat: 13.7466, lng: 100.5393 };
  assert.deepEqual(
    buildBookingRequest("2026-11-20T16:00:00", pickup, dropoff, "MEDIUM"),
    {
      pickup_address: "สยามพารากอน",
      pickup_lat: 13.7462,
      pickup_lng: 100.5347,
      dropoff_address: "เซ็นทรัลเวิลด์",
      dropoff_lat: 13.7466,
      dropoff_lng: 100.5393,
      scheduled_at: "2026-11-20T16:00:00",
      item_size: "MEDIUM",
    },
  );
});

test("AC-03-06 retry keeps the existing booking id", () => {
  assert.equal(retryPaymentBookingId(101, true), 101);
  assert.equal(retryPaymentBookingId(101, false), 101);
  assert.equal(retryPaymentBookingId(null, true), null);
});

test("AC-03-03 form changes invalidate the quote signature", () => {
  const pickup = { address: "สยามพารากอน", lat: 13.7462, lng: 100.5347 };
  const dropoff = { address: "เซ็นทรัลเวิลด์", lat: 13.7466, lng: 100.5393 };
  const quoted = createQuoteSignature("2026-11-20T16:00", pickup, dropoff, "MEDIUM");
  const changedDropoff = createQuoteSignature("2026-11-20T16:00", pickup, dropoff, "MEDIUM");
  assert.equal(isQuoteFresh(changedDropoff, quoted), true);
  assert.equal(
    isQuoteFresh(
      createQuoteSignature("2026-11-20T16:00", pickup, { ...dropoff, lat: 13.7649 }, "MEDIUM"),
      quoted,
    ),
    false,
  );
});
