"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { signUp } from "@/lib/auth";
import React from "react";
import { useFormState } from "react-dom";

const SignUpForm = () => {
  // The line below utilizes the `useFormState` custom hook to manage the state and action of the sign-up form.
  // `useFormState` is responsible for handling the form's state (input values, validation errors, etc.) and
  // provides an action to be triggered upon form submission.
  //
  // `signUp` is the server action that will be executed when the form is submitted (or when the user click the Sign Up button).
  // The second argument (`undefined`) might represent the initial state or configuration, but it's set to `undefined` here.
  //
  // The hook returns an array with two values:
  // 1. `state`: Contains the current state of the form, including input values, validation errors, and any other dynamic state.
  // 2. `action`: The function that triggers the form submission logic, invoking the `signUp` server action with the form data.
  //
  // This setup helps manage form state and server-side actions in a seamless manner within the Next.js app.

  // To clarify:
  // When the user first clicks the Sign Up Button, the form's `action` handler (which is the `action` returned by `useFormState`) is triggered.
  // This causes the form to submit and the server action (`signUp` from `auth.ts`) to be called.
  // Once the server action completes, the component will re-render with the updated `state` object, which contains the result of the server action.
  // In this case, the `state` will include any validation errors or success data returned by the `signUp` server action.

  const [state, action] = useFormState(signUp, undefined);
  return (
    <form action={action}>
      <div className="flex flex-col gap-2">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="John Doe" />
        </div>
        {state?.error?.name && (
          <p className="text-sm text-red-500">{state.error.name}</p>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="john@example.com" />
        </div>
        {state?.error?.email && (
          <p className="text-sm text-red-500">{state.error.email}</p>
        )}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
        </div>
        {state?.error?.password && (
          <div className="text-sm text-red-500">
            <p>Password must:</p>
            <ul>
              {state.error.password.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <SubmitButton>Sign Up</SubmitButton>
      </div>
    </form>
  );
};

export default SignUpForm;
