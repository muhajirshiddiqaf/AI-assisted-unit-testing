/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    loading: jest.fn(() => "toast-id"),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ message: "Login successful!" }),
    ok: true,
  })
) as jest.Mock;

describe("LoginPage", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  it("should render the login form", () => {
    render(<LoginPage />);
    
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  });

  it("should show validation errors for empty fields", async () => {
    render(<LoginPage />);
    
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it("should show validation error for short password", async () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i, { selector: 'input' }), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i, { selector: 'input' }), {
      target: { value: "123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    
    expect(await screen.findByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it("should submit form with valid data", async () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i, { selector: 'input' }), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i, { selector: 'input' }), {
      target: { value: "password123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/login",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        })
      );
    });
  });

  it("should handle successful login", async () => {
    const mockFetch = fetch as jest.Mock;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Login successful!" }),
    });

    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i, { selector: 'input' }), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i, { selector: 'input' }), {
      target: { value: "password123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it("should handle login error", async () => {
    const mockFetch = fetch as jest.Mock;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Invalid credentials" }),
    });

    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/Email/i, { selector: 'input' }), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i, { selector: 'input' }), {
      target: { value: "password123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it("should toggle password visibility", () => {
    render(<LoginPage />);
    
    const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' });
    const toggleButton = screen.getByRole("button", { name: /Show password/i });
    
    expect(passwordInput).toHaveAttribute("type", "password");
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /Hide password/i })).toBeInTheDocument();
    
    fireEvent.click(screen.getByRole("button", { name: /Hide password/i }));
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should update email and password state", () => {
    render(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/Email/i, { selector: 'input' });
    const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input' });
    
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "newpassword123" } });
    
    expect(emailInput).toHaveValue("new@example.com");
    expect(passwordInput).toHaveValue("newpassword123");
  });

  it("should not submit form when validation fails", async () => {
    render(<LoginPage />);
    
    // Don't fill any fields
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    
    // Wait a bit to ensure no fetch call is made
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(fetch).not.toHaveBeenCalled();
  });
});
