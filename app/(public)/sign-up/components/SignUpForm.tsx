"use client";

import Link from "next/link";
import Image from "next/image";
import { Form, Formik } from "formik";
import { InputField } from "@/components/forms/InputField";
import { PasswordField } from "@/components/forms/PasswordField";
import { Button } from "@/components/ui/button";
import { useSignUpFormHelper } from "./SignUpForm.helper";



export function SignUpForm() {
  const {
    initialValues,
    validationSchema,
    validateOnMount,
    handleSubmit,
    handleSocialClick,
    authError,
  } = useSignUpFormHelper();

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="font-heading text-2xl text-foreground">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join RecipeNest and start cooking
        </p>
      </div>

      {authError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {authError}
        </p>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount={validateOnMount}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <>
            <Form className="flex flex-col gap-5">
              <InputField
                name="name"
                label="Name"
                type="text"
                placeholder="Your full name"
                autoComplete="name"
              />

              <InputField
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />

              <PasswordField
                name="password"
                label="Password"
                placeholder="Create a password"
                autoComplete="new-password"
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !isValid}
              >
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </Button>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground tracking-wide">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
                onClick={() => handleSocialClick("google")}
              >
                <Image
                  src="/google-48.svg"
                  alt="Google"
                  width={20}
                  height={20}
                  className="h-5 w-5 shrink-0"
                />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                disabled={isSubmitting}
                onClick={() => handleSocialClick("github")}
              >
                <Image
                  src="/github-48.png"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="h-5 w-5 shrink-0"
                />
                Continue with GitHub
              </Button>
            </div>
          </>
        )}
      </Formik>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:text-primary-dark transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
