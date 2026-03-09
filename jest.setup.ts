import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "node:util";

if (!globalThis.TextEncoder) {
  Object.assign(globalThis, { TextEncoder });
}

if (!globalThis.TextDecoder) {
  Object.assign(globalThis, { TextDecoder });
}
