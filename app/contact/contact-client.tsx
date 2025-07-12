"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import contactConfig from "@/lib/contactConfig";
import {
  decodeEmail,
  validateContactForm,
  submitContactForm,
  ValidationErrors,
} from "@/lib/contactForm";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";

const iconComponents: Record<string, ReturnType<typeof dynamic>> = {
  FaGithub: dynamic(() => import("react-icons/fa").then((m) => m.FaGithub), {
    ssr: false,
  }),
  FaTwitter: dynamic(() => import("react-icons/fa").then((m) => m.FaTwitter), {
    ssr: false,
  }),
  FaLinkedin: dynamic(
    () => import("react-icons/fa").then((m) => m.FaLinkedin),
    { ssr: false }
  ),
  FaSlack: dynamic(() => import("react-icons/fa").then((m) => m.FaSlack), {
    ssr: false,
  }),
  FaDiscord: dynamic(() => import("react-icons/fa").then((m) => m.FaDiscord), {
    ssr: false,
  }),
};

export default function ContactClient() {
  const email = decodeEmail(contactConfig.email);
  const [data, setData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateContactForm(data, contactConfig.formFields);
    setErrors(v);
    if (Object.keys(v).length) return;
    setStatus("submitting");
    try {
      await submitContactForm(data);
      setStatus("success");
      setData({});
    } catch {
      setStatus("error");
    }
  };

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

      <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto text-center">
        Have questions or feedback? Email us at
        <a href={`mailto:${email}`} className="text-indigo-600 underline ml-1">
          {email}
        </a>
        .
      </p>

      <address className="mb-12 not-italic text-center">
        <ul className="flex justify-center space-x-4">
          {contactConfig.socialLinks.map(({ href, label, icon }) => {
            const Icon = iconComponents[icon];
            return (
              <li key={href} className="list-none">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors"
                >
                  {Icon && <Icon className="w-6 h-6" aria-hidden="true" />}
                  <span className="sr-only">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </address>

      <form
        onSubmit={onSubmit}
        action={`mailto:${email}`}
        method="POST"
        noValidate
        className="grid gap-6 sm:max-w-lg mx-auto"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {contactConfig.formFields.map((field) => (
            <div
              key={field.name}
              className={field.type === "textarea" ? "sm:col-span-2" : ""}
            >
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  value={data[field.name] || ""}
                  onChange={onChange}
                  className="mt-1"
                  rows={4}
                />
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  value={data[field.name] || ""}
                  onChange={onChange}
                  className="mt-1"
                />
              )}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>

        <div aria-live="polite" className="min-h-[1.5rem] text-center">
          {status === "error" && (
            <p className="text-red-700" role="alert">
              Something went wrong. Please try again.
            </p>
          )}
          {status === "success" && (
            <p className="text-green-700" role="status">
              Thank you! Your message has been sent.
            </p>
          )}
        </div>

        <div className="text-center">
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </section>
  );
}
