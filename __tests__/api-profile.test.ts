import { PUT } from "@/app/api/profile/route";
import { NextResponse } from "next/server";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data) => ({
      ...data,
      json: () => Promise.resolve(data),
    })),
  },
}));

const getValidProfileData = () => ({
  username: "validuser",
  fullName: "Valid User",
  email: "valid@email.com",
  phone: "1234567890",
});

describe("API /api/profile", () => {
  beforeEach(() => {
    (NextResponse.json as jest.Mock).mockClear();
  });

  it("should return 400 if username is too short", async () => {
    const invalidData = { ...getValidProfileData(), username: "short" };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { username: "Username must be at least 6 characters." },
      },
      { status: 400 }
    );
  });

  it("should return 400 if fullName is missing", async () => {
    const invalidData = { ...getValidProfileData(), fullName: "" };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { fullName: "Full name is required." },
      },
      { status: 400 }
    );
  });

  it("should return 200 on valid data", async () => {
    const validData = getValidProfileData();
    const req = {
      json: () => Promise.resolve(validData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
    });
  });

  it("should return 400 if email is invalid", async () => {
    const invalidData = { ...getValidProfileData(), email: "invalid-email" };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { email: "Must be a valid email format." },
      },
      { status: 400 }
    );
  });

  it("should return 400 if phone is invalid", async () => {
    const invalidData = { ...getValidProfileData(), phone: "123" };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { phone: "Phone must be 10-15 digits." },
      },
      { status: 400 }
    );
  });

  it("should return 400 if phone is too long", async () => {
    const invalidData = { ...getValidProfileData(), phone: "12345678901234567890" };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { phone: "Phone must be 10-15 digits." },
      },
      { status: 400 }
    );
  });

  it("should return 400 if birthDate is in the future", async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const invalidData = { 
      ...getValidProfileData(), 
      birthDate: tomorrow.toISOString().split('T')[0] 
    };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { birthDate: "Birth date cannot be in the future." },
      },
      { status: 400 }
    );
  });

  it("should accept valid birthDate in the past", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const validData = { 
      ...getValidProfileData(), 
      birthDate: yesterday.toISOString().split('T')[0] 
    };
    const req = {
      json: () => Promise.resolve(validData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
    });
  });

  it("should return 400 if bio is too long", async () => {
    const longBio = "a".repeat(161);
    const invalidData = { ...getValidProfileData(), bio: longBio };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: { bio: "Bio must be 160 characters or less." },
      },
      { status: 400 }
    );
  });

  it("should accept valid bio with 160 characters", async () => {
    const validBio = "a".repeat(160);
    const validData = { ...getValidProfileData(), bio: validBio };
    const req = {
      json: () => Promise.resolve(validData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
    });
  });

  it("should accept empty bio", async () => {
    const validData = { ...getValidProfileData(), bio: "" };
    const req = {
      json: () => Promise.resolve(validData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
    });
  });

  it("should accept undefined bio", async () => {
    const validData = { ...getValidProfileData() };
    delete (validData as any).bio;
    const req = {
      json: () => Promise.resolve(validData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
    });
  });

  it("should return multiple validation errors", async () => {
    const invalidData = {
      username: "short",
      fullName: "",
      email: "invalid-email",
      phone: "123",
    };
    const req = {
      json: () => Promise.resolve(invalidData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        message: "Validation failed",
        errors: {
          username: "Username must be at least 6 characters.",
          fullName: "Full name is required.",
          email: "Must be a valid email format.",
          phone: "Phone must be 10-15 digits.",
        },
      },
      { status: 400 }
    );
  });

  it("should handle complete valid profile data", async () => {
    const completeData = {
      username: "validuser123",
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      birthDate: "1990-01-01",
      bio: "This is a valid bio with 50 characters.",
    };
    const req = {
      json: () => Promise.resolve(completeData),
    } as Request;
    await PUT(req);
    expect(NextResponse.json).toHaveBeenCalledWith({
      success: true,
    });
  });
});
