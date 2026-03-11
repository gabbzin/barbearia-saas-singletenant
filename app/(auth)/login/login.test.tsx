import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { authClient } from "@/lib/auth-client";

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

import { Toaster } from "sonner";
import LoginPage from "./page";

describe("Login", () => {
  it("should show render errors when trying to submit without filling all required fields", async () => {
    const { getByText, findByText } = render(<LoginPage />);

    const submitButton = getByText(/logar conta/i);

    userEvent.click(submitButton);

    await findByText(/email inválido/i);
    await findByText(/senha inválida/i);
  });

  it("should show error if email is invalid", async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <LoginPage />,
    );

    const emailInput = getByPlaceholderText(/digite seu email/i);

    userEvent.type(emailInput, "invalid_email");

    const submitButton = getByText(/logar conta/i);

    userEvent.click(submitButton);

    await findByText(/email inválido/i);
  });

  it("should show error if user is not found", async () => {
    const mockSignIn = authClient as any;

    mockSignIn.signIn.email.mockImplementation(() => ({
      error: { message: "Invalid email or password" },
    }));

    render(
      <>
        <Toaster />
        <LoginPage />
      </>,
    );

    const emailInput = screen.getByPlaceholderText(/digite seu email/i);
    const passwordInput = screen.getByPlaceholderText(/digite sua senha/i);

    await userEvent.type(emailInput, "teste@gmail.com");
    await userEvent.type(passwordInput, "Password123.");

    const submitButton = screen.getByText(/logar conta/i);

    await userEvent.click(submitButton);

    await screen.findByText(/invalid email or password/i);
  });
});
