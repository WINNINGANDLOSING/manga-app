import { z } from "zod";

export type FormState =
  | {
      error?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type FormStateManga =
  | {
      error?: {
        title?: string[];
        synopsis?: string[];
        coverImage?: string[];
        alternative_titles?: string[][];
      };
      message?: string;
    }
  | undefined;


export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters long.",
    })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, {
      message: "Contain at least one letter.",
    })
    .regex(/[0-9]/, {
      message: "Contain at least one number.",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const SignInFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(1, { message: "Password field must have at least one character" }),
});

export enum Role {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  USER = "USER",
}

export const CreateMangaPage1Schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  coverImage: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Cover image is required",
    }),
  synopsis: z.string().min(5, { message: "Synopsis is required. Synopsis must be at least 5 characters long" }),
  alternateTitles: z
    .array(
      z.object({
        flag: z.string(),
        content: z.string(),
      })
    )
    .optional(),
});
