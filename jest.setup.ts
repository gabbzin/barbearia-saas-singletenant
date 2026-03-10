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

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
}));
