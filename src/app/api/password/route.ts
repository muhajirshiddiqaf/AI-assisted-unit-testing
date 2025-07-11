import { NextResponse } from "next/server";

type PasswordChangeData = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export async function POST(request: Request) {
  const { currentPassword, newPassword, confirmPassword }: PasswordChangeData =
    await request.json();

  const errors: Partial<Record<keyof PasswordChangeData, string>> = {};

  if (!currentPassword) {
    errors.currentPassword = "Current password is required.";
  }

  if (!newPassword) {
    errors.newPassword = "New password is required.";
  } else if (newPassword.length < 6) {
    errors.newPassword = "New password must be at least 6 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Password confirmation is required.";
  } else if (newPassword && confirmPassword !== newPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.newPassword = "New password must be different from current password.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: "Validation failed", errors },
      { status: 400 }
    );
  }

  // Mock authentication logic - in real app, verify current password
  if (currentPassword !== "password123") {
    return NextResponse.json(
      { message: "Current password is incorrect." },
      { status: 401 }
    );
  }

  // In a real application, you would update the user's password in the database.
  console.log("Changing password for user:", {
    currentPassword: "***",
    newPassword: "***",
  });

  return NextResponse.json({ 
    message: "Password changed successfully!",
    success: true 
  });
}
