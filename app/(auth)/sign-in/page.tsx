"use client";

import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signInwithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      const result = await signInwithEmail(data);
      if(result.success) router.push('/');
       else {
      // Handle failed login
      toast.error("Failed to sign in", {
        description: result?.message || "Invalid email or password"
      });
    }
      // TODO: Add actual sign-in logic (API call / auth)
    } catch (error) {
      console.log("Error signing in:", error);
      toast.error("Failed to sign in. Please try again.");
    }
  };

  return (
    <>
      <h1 className="form-title">Log In to Continue</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <InputField
          name="email"
          label="Email Address"
          placeholder="Enter your email"
          register={register}
          error={errors.email}
          validation={{
            required: "Email address is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          }}
        />

        {/* Password */}
        <InputField
          name="password"
          label="Password"
          placeholder="Enter your password"
          type="password"
          register={register}
          error={errors.password}
          validation={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          }}
        />

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
        {/* Footer Link */}
        <FooterLink
          text="Don’t have an account?"
          linkText="Sign Up"
          href="/sign-up"
        />
      </form>
    </>
  );
};

export default SignIn;
