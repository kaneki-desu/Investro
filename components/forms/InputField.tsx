'use client';
import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  // if input is password — make it toggleable
  const isPassword = type === "password";

  return (
    <div className="space-y-2 relative">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <div className="relative">
        <Input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          className={cn(
            'form-input pr-10', // add padding for the eye icon
            { 'opacity-50 cursor-not-allowed': disabled }
          )}
          {...register(name, validation)}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputField;
