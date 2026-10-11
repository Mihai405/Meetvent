// Simulates a network request so loading and error states can be seen in the prototype.
// EXPO_PUBLIC_SIMULATE_ERROR=1 makes the first attempt fail.
import {useCallback, useEffect, useRef, useState} from "react";

const DELAY_MS = 600;
const SIMULATE_ERROR = process.env.EXPO_PUBLIC_SIMULATE_ERROR === "1";

export type QueryStatus = "loading" | "error" | "success";

export function useMockQuery(): {status: QueryStatus; retry: () => void} {
  const [status, setStatus] = useState<QueryStatus>("loading");
  const attempt = useRef(0);

  const run = useCallback(() => {
    setStatus("loading");
    const failing = SIMULATE_ERROR && attempt.current === 0;
    attempt.current += 1;
    const timer = setTimeout(() => setStatus(failing ? "error" : "success"), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => run(), [run]);

  return {status, retry: run};
}
