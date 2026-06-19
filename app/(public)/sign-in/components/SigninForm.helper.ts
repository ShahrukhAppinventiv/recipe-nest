"use client";

import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { toast } from "sonner";
import {
  signInWithCredentials,
  signInWithProvider,
} from "@/lib/services/auth.service";
import { AUTH_ROUTES, type SocialLoginProvider } from "@/lib/constants/constants";
import { passwordSchema } from "@/lib/validation/password.schema";

const initialValues = {
  email: "",
  password: "",
};

const signInSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: passwordSchema,
});

export const useSignInFormHelper = () => {
  const router = useRouter();

  const handleSubmit = async (values: typeof initialValues) => {
    const response = await signInWithCredentials(
      values.email,
      values.password,
    );

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    router.push(AUTH_ROUTES.HOME);
    router.refresh();
  };

  const handleSocialClick = async (provider: SocialLoginProvider) => {
    await signInWithProvider(provider);
  };

  return {
    initialValues,
    validationSchema: signInSchema,
    validateOnMount: true as const,
    handleSubmit,
    handleSocialClick,
  };
};
