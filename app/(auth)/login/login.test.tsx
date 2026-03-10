import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: jest.fn().mockResolvedValue({ error: null }),
    },
  },
}));

jest.mock("@better-auth/stripe/client", () => ({
  stripeClient: () => () => ({}),
}));

import LoginPage from "./page";

describe("Login", () => {
  it("should show render errors when trying to submit without filling all required fields", () => {
    const { getByText, findByText } = render(<LoginPage />);

    const submitButton = getByText(/logar conta/i);

    userEvent.click(submitButton);

    findByText(/email inválido/i);
    findByText(/senha inválida/i);
  });
});
