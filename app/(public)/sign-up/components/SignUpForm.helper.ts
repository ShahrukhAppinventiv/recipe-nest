"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";
import {
  signInWithProvider,
  signUpUser,
} from "@/lib/services/auth.service";
import { AUTH_ROUTES, type SocialLoginProvider } from "@/lib/constants/constants";
import { passwordSchema } from "@/lib/validation/password.schema";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const signUpSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: passwordSchema,
});

export const useSignUpFormHelper = () => {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (values: typeof initialValues) => {
    setAuthError(null);

    const response = await signUpUser(values);

    if (!response.success) {
      setAuthError(response.message);
      return;
    }

    router.push(AUTH_ROUTES.HOME);
    router.refresh();
  };

  const handleSocialClick = async (provider: SocialLoginProvider) => {
    setAuthError(null);
    await signInWithProvider(provider);
  };

  return {
    initialValues,
    validationSchema: signUpSchema,
    validateOnMount: true as const,
    handleSubmit,
    handleSocialClick,
    authError,
  };
};
