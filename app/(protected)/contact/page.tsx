"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Clock, Mail, MapPin, MessageSquare, Send, Sparkles } from "lucide-react";
import { InputField } from "@/components/forms/InputField";
import { TextareaField } from "@/components/forms/TextareaField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ContactFormValues = {
  subject: string;
  message: string;
};

const initialValues: ContactFormValues = {
  subject: "",
  message: "",
};

const validationSchema = Yup.object({
  subject: Yup.string().trim().required("Subject is required"),
  message: Yup.string()
    .trim()
    .min(20, "Message must be at least 20 characters")
    .required("Message is required"),
});

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email us",
    value: "hello@recipenest.com",
    description: "We'll reply within 24 hours",
  },
  {
    icon: Clock,
    label: "Office hours",
    value: "Mon – Fri, 9 am – 6 pm",
    description: "We're here during business hours",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: "Remote-first team",
    description: "Serving kitchens everywhere",
  },
] as const;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(
    values: ContactFormValues,
    { resetForm }: { resetForm: () => void },
  ) {
    setServerError(null);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = await response.json();

    if (!response.ok) {
      setServerError(result.message ?? "Failed to send message. Please try again.");
      return;
    }

    resetForm();
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-white p-6 shadow-premium sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08),transparent_45%)]" />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Get in touch
          </div>

          <h1 className="mt-5 font-heading text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">
            Contact us
          </h1>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Have a question, feedback, or recipe suggestion? We&apos;d love to
            hear from you.
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageSquare className="h-4 w-4" aria-hidden />
              </div>
              <div>
                <CardTitle className="text-lg">Send us a message</CardTitle>
                <CardDescription>
                  Fill in the form and we&apos;ll get back to you shortly
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-10 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Send className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="font-heading text-xl text-foreground">
                  Message sent!
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thanks for reaching out. We&apos;ll reply within 24 hours.
                </p>
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, isValid, dirty }) => (
                  <Form className="flex flex-col gap-5">
                    {serverError ? (
                      <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                        {serverError}
                      </p>
                    ) : null}

                    <InputField
                      name="subject"
                      label="Subject"
                      placeholder="What's this about?"
                    />

                    <TextareaField
                      name="message"
                      label="Message"
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      className="w-fit rounded-xl px-6"
                      disabled={isSubmitting || !isValid || !dirty}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send message
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          {CONTACT_DETAILS.map(({ icon: Icon, label, value, description }) => (
            <Card key={label} className="shadow-soft">
              <CardHeader className="gap-3 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-base">{label}</CardTitle>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {value}
                  </p>
                  <CardDescription className="mt-0.5 text-xs">
                    {description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
