/**
 * @jest-environment node
 */
import { POST } from "@/app/api/password/route";
import { NextResponse } from "next/server";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      ...data,
      json: () => Promise.resolve(data),
      status: options?.status || 200,
    })),
  },
}));

describe("POST /api/password", () => {
  beforeEach(() => {
    (NextResponse.json as jest.Mock).mockClear();
  });

  it("should return 400 if current password is missing", async () => {
    const req = {
      json: () => Promise.resolve({ 
        newPassword: "newpassword123", 
        confirmPassword: "newpassword123" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { currentPassword: "Current password is required." },
      },
      { status: 400 }
    );
  });

  it("should return 400 if new password is missing", async () => {
    const req = {
      json: () => Promise.resolve({ 
        currentPassword: "password123", 
        confirmPassword: "newpassword123" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { newPassword: "New password is required." },
      },
      { status: 400 }
    );
  });

  it("should return 400 if confirm password is missing", async () => {
    const req = {
      json: () => Promise.resolve({ 
        currentPassword: "password123", 
        newPassword: "newpassword123" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { confirmPassword: "Password confirmation is required." },
      },
      { status: 400 }
    );
  });

  it("should return 400 if new password is too short", async () => {
    const req = {
      json: () => Promise.resolve({ 
        currentPassword: "password123", 
        newPassword: "123", 
        confirmPassword: "123" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { newPassword: "New password must be at least 6 characters." },
      },
      { status: 400 }
    );
  });

  it("should return 400 if passwords do not match", async () => {
    const req = {
      json: () => Promise.resolve({ 
        currentPassword: "password123", 
        newPassword: "newpassword123", 
        confirmPassword: "differentpassword123" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { confirmPassword: "Passwords do not match." },
      },
      { status: 400 }
    );
  });

  it("should return 400 if new password is same as current password", async () => {
    const req = {
      json: () => Promise.resolve({ 
        currentPassword: "password123", 
        newPassword: "password123", 
        confirmPassword: "password123" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { newPassword: "New password must be different from current password." },
      },
      { status: 400 }
    );
  });

  it("should return 401 if current password is incorrect", async () => {
    const req = {
      json: () => Promise.resolve({ 
        currentPassword: "wrongpassword", 
        newPassword: "newpassword123", 
        confirmPassword: "newpassword123" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Current password is incorrect." },
      { status: 401 }
    );
  });

  it("should return 200 for valid password change", async () => {
    const req = {
      json: () => Promise.resolve({ 
        currentPassword: "password123", 
        newPassword: "newpassword123", 
        confirmPassword: "newpassword123" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith({
      message: "Password changed successfully!",
      success: true,
    });
  });

  it("should return multiple validation errors", async () => {
    const req = {
      json: () => Promise.resolve({ 
        currentPassword: "", 
        newPassword: "123", 
        confirmPassword: "different" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: {
          currentPassword: "Current password is required.",
          newPassword: "New password must be at least 6 characters.",
          confirmPassword: "Passwords do not match.",
        },
      },
      { status: 400 }
    );
  });

  it("should handle edge case with minimum valid password length", async () => {
    const req = {
      json: () => Promise.resolve({ 
        currentPassword: "password123", 
        newPassword: "123456", 
        confirmPassword: "123456" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith({
      message: "Password changed successfully!",
      success: true,
    });
  });

  it("should handle empty strings as missing values", async () => {
    const req = {
      json: () => Promise.resolve({ 
        currentPassword: "", 
        newPassword: "", 
        confirmPassword: "" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: {
          currentPassword: "Current password is required.",
          newPassword: "New password is required.",
          confirmPassword: "Password confirmation is required.",
        },
      },
      { status: 400 }
    );
  });
}); 