/** biome-ignore-all lint/suspicious/noExplicitAny: <Relaxa chefe> */
import "@testing-library/jest-dom";

// add any global test setup here
import { TextDecoder, TextEncoder } from "node:util";

if (!(global as any).TextEncoder) {
  (global as any).TextEncoder = TextEncoder;
}

if (!(global as any).TextDecoder) {
  (global as any).TextDecoder = TextDecoder;
}
