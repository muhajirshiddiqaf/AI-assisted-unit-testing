"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

type PasswordErrors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export default function PasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<PasswordErrors>({});

  const validate = () => {
    const newErrors: PasswordErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Password confirmation is required.";
    } else if (newPassword && confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = "New password must be different from current password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const toastId = toast.loading("Changing password...");

    const response = await fetch("/api/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Password changed successfully!", { id: toastId });
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } else {
      toast.error(data.message || "An error occurred.", { id: toastId });
    }
  };

  const PasswordInput = ({
    id,
    label,
    value,
    onChange,
    showPassword,
    setShowPassword,
    error,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showPassword: boolean;
    setShowPassword: (show: boolean) => void;
    error?: string;
  }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 3C5 3 1.73 7.11 1.08 7.98a1 1 0 000 1.04C1.73 12.89 5 17 10 17s8.27-4.11 8.92-4.98a1 1 0 000-1.04C18.27 7.11 15 3 10 3zm0 12c-3.87 0-7.16-3.13-7.72-3.8C2.84 10.13 6.13 7 10 7s7.16 3.13 7.72 3.8C17.16 11.87 13.87 15 10 15zm0-8a4 4 0 100 8 4 4 0 000-8zm0 6a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4.03 3.97a.75.75 0 10-1.06 1.06l1.1 1.1C2.7 7.11 1.73 8.89 1.08 9.96a1 1 0 000 1.08C1.73 12.89 5 17 10 17c1.61 0 3.09-.37 4.38-1.01l1.59 1.59a.75.75 0 101.06-1.06l-15-15zm7.45 9.57a2 2 0 01-2.45-2.45l2.45 2.45zm-4.02-4.02l2.45 2.45a2 2 0 01-2.45-2.45zm9.54 2.44c-.56.67-3.85 3.8-7.72 3.8-1.61 0-3.09-.37-4.38-1.01l1.59 1.59a.75.75 0 101.06-1.06l-1.1-1.1C2.7 12.89 1.73 11.11 1.08 10.04a1 1 0 010-1.08C1.73 7.11 5 3 10 3c1.61 0 3.09.37 4.38 1.01l1.59-1.59a.75.75 0 101.06 1.06l-1.1 1.1C17.3 7.11 18.27 8.89 18.92 9.96a1 1 0 010 1.08z" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Change Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PasswordInput
            id="currentPassword"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            showPassword={showCurrentPassword}
            setShowPassword={setShowCurrentPassword}
            error={errors.currentPassword}
          />
          
          <PasswordInput
            id="newPassword"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            showPassword={showNewPassword}
            setShowPassword={setShowNewPassword}
            error={errors.newPassword}
          />
          
          <PasswordInput
            id="confirmPassword"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            error={errors.confirmPassword}
          />
          
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 