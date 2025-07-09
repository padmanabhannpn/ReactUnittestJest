import { fireEvent, render, screen,waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../LoginPage";

describe("Login Page", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    mockLogin.mockReset();
    render(<LoginPage onLogin={mockLogin}></LoginPage>);
  });

  it("render Login From", () => {
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("show validation error when the login submitted empty value", async () => {
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/Username is required/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Password is required/i)
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("shows password length error when password is too short", async () => {
    userEvent.type(screen.getByLabelText(/username/i), "testuser");
    userEvent.type(screen.getByLabelText(/password/i), "123");
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(
      await screen.findByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });


  it('calls onLogin with correct data when form is valid', async () => {
    const testData = {
      username: 'testuser',
      password: 'password123'
    };

    userEvent.type(screen.getByLabelText(/username/i), testData.username);
    userEvent.type(screen.getByLabelText(/password/i), testData.password);
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(testData.username, testData.password);
    });
  });


   it('shows loading state during submission', async () => {
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));

    userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/logging in.../i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('displays server error when login fails', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockRejectedValue(new Error(errorMessage));

    userEvent.type(screen.getByLabelText(/username/i), 'testuser');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

});
