"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import contactConfig from "@/lib/contactConfig";
import { buildMailto, validate, obfuscateEmail } from "@/lib/contactForm";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";

function getIcon(name: string) {
  return dynamic(() => import("react-icons/fa").then((m) => (m as any)[name]), {
    ssr: false,
  });
}

export default function ContactClient() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const values: Record<string, string> = {};
    contactConfig.formFields.forEach((f) => {
      values[f.name] = (data.get(f.name) as string) || "";
    });
    const errs = validate(values, contactConfig.formFields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setStatus("error");
      return;
    }
    setErrors({});
    const mailto = buildMailto(contactConfig.emails[0], values);
    window.location.href = mailto;
    setStatus("success");
    form.reset();
  };

  const emailLink = useMemo(
    () => obfuscateEmail(contactConfig.emails[0]),
    []
  );

  return (
    <section
      id="contact-gearizen"
      aria-labelledby="contact-heading"
      className="container-responsive py-20 text-gray-900"
    >
      <h1
        id="contact-heading"
        className="gradient-text text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-center"
      >
        Contact Us
      </h1>
      <p className="text-lg text-gray-700 mb-12 max-w-xl mx-auto text-center">
        Have questions or feedback? Reach us via the form below or email us at{' '}
        <a
          href={`mailto:${contactConfig.emails[0]}`}
          dangerouslySetInnerHTML={{ __html: emailLink }}
          className="text-indigo-600 underline"
        />
        .
      </p>

      <div className="grid gap-12 lg:grid-cols-2">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          action={`mailto:${contactConfig.emails[0]}`}
          method="post"
          className="space-y-6"
        >
          {contactConfig.formFields.map((field) => (
            <div
              key={field.name}
              className="flex flex-col sm:flex-row sm:items-center sm:gap-4 lg:flex-col lg:items-start"
            >
              <label
                htmlFor={field.name}
                className="mb-2 sm:mb-0 sm:w-32 font-medium text-gray-800"
              >
                {field.label}
                {field.required && <span className="text-red-600">*</span>}
              </label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  rows={5}
                  className="sm:flex-1"
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  className="sm:flex-1"
                />
              )}
              {errors[field.name] && (
                <span
                  role="alert"
                  className="text-sm text-red-600 mt-1 sm:ml-4"
                  aria-live="assertive"
                >
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}
          <Button type="submit" className="w-full sm:w-auto">
            Send Message
          </Button>
          {status === "success" && (
            <div
              role="status"
              className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md mt-4"
            >
              Thank you! Your message has been prepared in your email client.
            </div>
          )}
          {status === "error" && Object.keys(errors).length > 0 && (
            <div
              role="alert"
              aria-live="assertive"
              className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mt-4"
            >
              Please correct the highlighted fields.
            </div>
          )}
        </form>

        <address className="not-italic space-y-4 text-gray-700">
          <h2 className="text-xl font-semibold">Other Channels</h2>
          <ul className="space-y-2">
            {contactConfig.social.map((s) => {
              const Icon = getIcon(s.icon);
              return (
                <li key={s.href} className="flex items-center space-x-2">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                  >
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </address>
      </div>
    </section>
  );
}
