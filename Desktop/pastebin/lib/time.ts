export function getNow(headers: Headers): number {
  if (process.env.TEST_MODE === "1") {
    const raw = headers.get("x-test-now-ms");
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return Date.now();
}