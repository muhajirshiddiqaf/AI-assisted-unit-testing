/**
 * @jest-environment node
 */
import { POST } from "@/app/api/login/route";
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

describe("POST /api/login", () => {
  beforeEach(() => {
    (NextResponse.json as jest.Mock).mockClear();
  });

  it("should return 400 if email is missing", async () => {
    const req = {
      json: () => Promise.resolve({ password: "password123" }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Email and password are required." },
      { status: 400 }
    );
  });

  it("should return 400 if password is missing", async () => {
    const req = {
      json: () => Promise.resolve({ email: "test@example.com" }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Email and password are required." },
      { status: 400 }
    );
  });

  it("should return 400 if both email and password are missing", async () => {
    const req = {
      json: () => Promise.resolve({}),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Email and password are required." },
      { status: 400 }
    );
  });

  it("should return 400 if password is too short", async () => {
    const req = {
      json: () => Promise.resolve({ 
        email: "test@example.com", 
        password: "123" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Password must be at least 6 characters." },
      { status: 400 }
    );
  });

  it("should return 200 for valid credentials", async () => {
    const req = {
      json: () => Promise.resolve({ 
        email: "test@example.com", 
        password: "password123" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Login successful!" }
    );
  });

  it("should return 401 for invalid credentials", async () => {
    const req = {
      json: () => Promise.resolve({ 
        email: "wrong@example.com", 
        password: "wrongpassword" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Invalid credentials." },
      { status: 401 }
    );
  });

  it("should return 401 for wrong password with correct email", async () => {
    const req = {
      json: () => Promise.resolve({ 
        email: "test@example.com", 
        password: "wrongpassword" 
      }),
    } as Request;
    
    await POST(req);
    
    expect(NextResponse.json).toHaveBeenCalledWith(
      { message: "Invalid credentials." },
      { status: 401 }
    );
  });
});
