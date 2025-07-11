/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PasswordPage from "@/app/password/page";

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
    json: () => Promise.resolve({ message: "Password changed successfully!", success: true }),
    ok: true,
  })
) as jest.Mock;

describe("PasswordPage", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  it("should render the password change form", () => {
    render(<PasswordPage />);
    
    expect(screen.getByRole("heading", { name: "Change Password" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm New Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Change Password/i })).toBeInTheDocument();
  });

  it("should show validation errors for empty fields", async () => {
    render(<PasswordPage />);
    
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    
    expect(await screen.findByText(/Current password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/New password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password confirmation is required/i)).toBeInTheDocument();
  });

  it("should show validation error for short new password", async () => {
    render(<PasswordPage />);
    
    fireEvent.change(screen.getByLabelText('Current Password', { selector: 'input', exact: true }), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText('New Password', { selector: 'input', exact: true }), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password', { selector: 'input', exact: true }), {
      target: { value: "123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    
    expect(await screen.findByText(/New password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it("should show validation error when passwords do not match", async () => {
    render(<PasswordPage />);
    
    fireEvent.change(screen.getByLabelText('Current Password', { selector: 'input', exact: true }), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText('New Password', { selector: 'input', exact: true }), {
      target: { value: "newpassword123" },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password', { selector: 'input', exact: true }), {
      target: { value: "differentpassword123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it("should show validation error when new password is same as current", async () => {
    render(<PasswordPage />);
    
    fireEvent.change(screen.getByLabelText('Current Password', { selector: 'input', exact: true }), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText('New Password', { selector: 'input', exact: true }), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password', { selector: 'input', exact: true }), {
      target: { value: "password123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    
    expect(await screen.findByText(/New password must be different from current password/i)).toBeInTheDocument();
  });

  it("should submit form with valid data", async () => {
    render(<PasswordPage />);
    
    fireEvent.change(screen.getByLabelText('Current Password', { selector: 'input', exact: true }), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText('New Password', { selector: 'input', exact: true }), {
      target: { value: "newpassword123" },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password', { selector: 'input', exact: true }), {
      target: { value: "newpassword123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/password",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: "password123",
            newPassword: "newpassword123",
            confirmPassword: "newpassword123",
          }),
        })
      );
    });
  });

  it("should handle successful password change", async () => {
    const mockFetch = fetch as jest.Mock;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Password changed successfully!", success: true }),
    });

    render(<PasswordPage />);
    
    fireEvent.change(screen.getByLabelText('Current Password', { selector: 'input', exact: true }), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText('New Password', { selector: 'input', exact: true }), {
      target: { value: "newpassword123" },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password', { selector: 'input', exact: true }), {
      target: { value: "newpassword123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it("should handle password change error", async () => {
    const mockFetch = fetch as jest.Mock;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Current password is incorrect" }),
    });

    render(<PasswordPage />);
    
    fireEvent.change(screen.getByLabelText('Current Password', { selector: 'input', exact: true }), {
      target: { value: "wrongpassword" },
    });
    fireEvent.change(screen.getByLabelText('New Password', { selector: 'input', exact: true }), {
      target: { value: "newpassword123" },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password', { selector: 'input', exact: true }), {
      target: { value: "newpassword123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it("should toggle password visibility for all fields", () => {
    render(<PasswordPage />);
    
    const currentPasswordInput = screen.getByLabelText(/Current Password/i, { selector: 'input' });
    const newPasswordInput = screen.getByLabelText(/New Password/i, { selector: 'input' });
    const confirmPasswordInput = screen.getByLabelText(/Confirm New Password/i, { selector: 'input' });
    
    // Current password toggle
    const toggleButtons = screen.getAllByRole("button", { name: /Show password/i });
    const currentToggleButton = toggleButtons[0];
    expect(currentPasswordInput).toHaveAttribute("type", "password");
    
    fireEvent.click(currentToggleButton);
    expect(currentPasswordInput).toHaveAttribute("type", "text");
    
    fireEvent.click(currentToggleButton);
    expect(currentPasswordInput).toHaveAttribute("type", "password");
    
    // New password toggle
    const newToggleButton = toggleButtons[1];
    expect(newPasswordInput).toHaveAttribute("type", "password");
    
    fireEvent.click(newToggleButton);
    expect(newPasswordInput).toHaveAttribute("type", "text");
    
    fireEvent.click(newToggleButton);
    expect(newPasswordInput).toHaveAttribute("type", "password");
    
    // Confirm password toggle
    const confirmToggleButton = toggleButtons[2];
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    
    fireEvent.click(confirmToggleButton);
    expect(confirmPasswordInput).toHaveAttribute("type", "text");
    
    fireEvent.click(confirmToggleButton);
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
  });

  it("should update all form fields correctly", () => {
    render(<PasswordPage />);
    
    const currentPasswordInput = screen.getByLabelText('Current Password', { selector: 'input', exact: true });
    const newPasswordInput = screen.getByLabelText('New Password', { selector: 'input', exact: true });
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password', { selector: 'input', exact: true });
    
    fireEvent.change(currentPasswordInput, { target: { value: "oldpassword" } });
    fireEvent.change(newPasswordInput, { target: { value: "newpassword" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "newpassword" } });
    
    expect(currentPasswordInput).toHaveValue("oldpassword");
    expect(newPasswordInput).toHaveValue("newpassword");
    expect(confirmPasswordInput).toHaveValue("newpassword");
  });

  it("should not submit form when validation fails", async () => {
    render(<PasswordPage />);
    
    // Don't fill any fields
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    
    // Wait a bit to ensure no fetch call is made
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should clear form after successful submission", async () => {
    const mockFetch = fetch as jest.Mock;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Password changed successfully!", success: true }),
    });

    render(<PasswordPage />);
    
    const currentPasswordInput = screen.getByLabelText('Current Password', { selector: 'input', exact: true });
    const newPasswordInput = screen.getByLabelText('New Password', { selector: 'input', exact: true });
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password', { selector: 'input', exact: true });
    
    fireEvent.change(currentPasswordInput, { target: { value: "password123" } });
    fireEvent.change(newPasswordInput, { target: { value: "newpassword123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "newpassword123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    
    await waitFor(() => {
      expect(currentPasswordInput).toHaveValue("");
      expect(newPasswordInput).toHaveValue("");
      expect(confirmPasswordInput).toHaveValue("");
    });
  });

  it("should handle minimum valid password length", async () => {
    render(<PasswordPage />);
    
    fireEvent.change(screen.getByLabelText('Current Password', { selector: 'input', exact: true }), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText('New Password', { selector: 'input', exact: true }), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password', { selector: 'input', exact: true }), {
      target: { value: "123456" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it("should show multiple validation errors at once", async () => {
    render(<PasswordPage />);
    
    fireEvent.change(screen.getByLabelText('Current Password', { selector: 'input', exact: true }), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText('New Password', { selector: 'input', exact: true }), {
      target: { value: "123" },
    });
    fireEvent.change(screen.getByLabelText('Confirm New Password', { selector: 'input', exact: true }), {
      target: { value: "different" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    
    expect(await screen.findByText(/Current password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/New password must be at least 6 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });
}); 