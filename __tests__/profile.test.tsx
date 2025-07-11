/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "@/app/profile/page";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    loading: jest.fn(() => "toast-id"),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: true }),
    ok: true,
  })
) as jest.Mock;

describe("ProfilePage", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<ProfilePage />);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Birth Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Update/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty/invalid fields", async () => {
    render(<ProfilePage />);
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    expect(
      await screen.findByText(/Username must be at least 6 characters/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Must be a valid email format/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Phone must be 10-15 digits/i)).toBeInTheDocument();
  });

  it("submits valid form and shows success message", async () => {
    render(<ProfilePage />);
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Update/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "/api/profile",
        expect.objectContaining({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  it("should show validation error for short username", async () => {
    render(<ProfilePage />);
    
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    
    expect(await screen.findByText(/Username must be at least 6 characters/i)).toBeInTheDocument();
  });

  it("should show validation error for invalid email", async () => {
    render(<ProfilePage />);
    
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    
    expect(await screen.findByText(/Invalid email format/i)).toBeInTheDocument();
  });

  it("should show validation error for short phone number", async () => {
    render(<ProfilePage />);
    
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "123" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    
    expect(await screen.findByText(/Phone must be 10-15 digits/i)).toBeInTheDocument();
  });

  it("should show validation error for long phone number", async () => {
    render(<ProfilePage />);
    
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "12345678901234567890" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    
    expect(await screen.findByText(/Phone must be 10-15 digits/i)).toBeInTheDocument();
  });

  it("should show validation error for future birth date", async () => {
    render(<ProfilePage />);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), {
      target: { value: tomorrowString },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    
    expect(await screen.findByText(/Birth date cannot be in the future/i)).toBeInTheDocument();
  });

  it("should accept valid birth date in the past", async () => {
    render(<ProfilePage />);
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), {
      target: { value: yesterdayString },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it("should show validation error for long bio", async () => {
    render(<ProfilePage />);
    
    const longBio = "a".repeat(161);
    
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Bio/i), {
      target: { value: longBio },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    
    expect(await screen.findByText(/Bio must be 160 characters or less/i)).toBeInTheDocument();
  });

  it("should accept valid bio with 160 characters", async () => {
    render(<ProfilePage />);
    
    const validBio = "a".repeat(160);
    
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByLabelText(/Bio/i), {
      target: { value: validBio },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it("should handle successful profile update", async () => {
    const mockFetch = fetch as jest.Mock;
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });

    render(<ProfilePage />);
    
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/profile",
        expect.objectContaining({
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "validuser",
            fullName: "John Doe",
            email: "john@example.com",
            phone: "1234567890",
            birthDate: "",
            bio: "",
          }),
        })
      );
    });
  });

  it("should handle profile update error", async () => {
    const mockFetch = fetch as jest.Mock;
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: "Update failed" }),
    });

    render(<ProfilePage />);
    
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "validuser" },
    });
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Phone/i), {
      target: { value: "1234567890" },
    });
    
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it("should not submit form when validation fails", async () => {
    render(<ProfilePage />);
    
    // Don't fill any fields
    fireEvent.click(screen.getByRole("button", { name: /Update/i }));
    
    // Wait a bit to ensure no fetch call is made
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should update all form fields correctly", () => {
    render(<ProfilePage />);
    
    const usernameInput = screen.getByLabelText(/Username/i);
    const fullNameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const phoneInput = screen.getByLabelText(/Phone/i);
    const birthDateInput = screen.getByLabelText(/Birth Date/i);
    const bioInput = screen.getByLabelText(/Bio/i);
    
    fireEvent.change(usernameInput, { target: { value: "newusername" } });
    fireEvent.change(fullNameInput, { target: { value: "New Name" } });
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "9876543210" } });
    fireEvent.change(birthDateInput, { target: { value: "1990-01-01" } });
    fireEvent.change(bioInput, { target: { value: "New bio" } });
    
    expect(usernameInput).toHaveValue("newusername");
    expect(fullNameInput).toHaveValue("New Name");
    expect(emailInput).toHaveValue("new@example.com");
    expect(phoneInput).toHaveValue("9876543210");
    expect(birthDateInput).toHaveValue("1990-01-01");
    expect(bioInput).toHaveValue("New bio");
  });
});
