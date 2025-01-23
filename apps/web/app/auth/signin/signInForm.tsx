"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import Link from "next/link";
import { useFormState } from "react-dom";
import { signIn } from "@/lib/auth";
// To clarify:
// When the user first clicks the Sign In  Button, the form's `action` handler (which is the `action` returned by `useFormState`) is triggered.
// This causes the form to submit and the server action (`signIn` from `auth.ts`) to be called.
// Once the server action completes, the component will re-render with the updated `state` object, which contains the result of the server action.
// In this case, the `state` will include any validation errors or success data returned by the `signIn` server action.
const SignInForm = () => {
  const [state, action] = useFormState(signIn, undefined);
  return (
    <form action={action}>
      <div className="flex flex-col gap-2 w-64">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="john@example.com"
            type="email"
          />
        </div>
        {state?.error?.email && (
          <p className="text-sm text-red-500">{state.error.email}</p>
        )}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
        </div>
        {state?.error?.password && (
          <p className="text-sm text-red-500">{state.error.password}</p>
        )}
        <Link className="text-sm underline" href="#">
          Forgot your password?
        </Link>

        <SubmitButton>Sign In</SubmitButton>

        <div className="flex text-sm justify-between">
          <p className="text-red-500"> Don't have an account?</p>
          <Link href="/auth/signup" className="text-sm underline">
            Sign Up Now
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
