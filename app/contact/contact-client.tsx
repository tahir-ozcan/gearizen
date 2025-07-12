"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import {
  contactConfig,
  decodeEmail,
  validateContact,
  sendContactForm,
  ContactChannel,
} from "@/lib/contactConfig";

interface Status {
  type: "idle" | "submitting" | "success" | "error";
  message: string;
}

const iconCache: Record<string, ReturnType<typeof dynamic>> = {};
function getIcon(name: string) {
  if (!iconCache[name]) {
    iconCache[name] = dynamic(
      () => import("react-icons/fa").then((m) => (m as any)[name]),
      { ssr: false }
    );
  }
  return iconCache[name];
}

export default function ContactClient() {
  const email = decodeEmail(contactConfig.encodedEmail);
  const [data, setData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContact(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus({ type: "error", message: "Please correct the form." });
      return;
    }
    setStatus({ type: "submitting", message: "Sending..." });
    try {
      await sendContactForm(data);
      setStatus({ type: "success", message: "Message prepared in your email client." });
      setData({});
    } catch (err) {
      setStatus({ type: "error", message: "Failed to send." });
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
      <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto text-center">
        Have questions or feedback? Email us at
        <a
          href={`mailto:${email}`}
          className="text-indigo-600 underline ml-1"
        >
          {email}
        </a>
        .
      </p>
      <ul className="flex justify-center space-x-4 mb-12">
        {contactConfig.channels.map((c: ContactChannel) => {
          const Icon = getIcon(c.icon);
          return (
            <li key={c.href} className="list-none">
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={c.label}
                className="text-gray-500 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors"
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>

      <form
        onSubmit={handleSubmit}
        action={`mailto:${email}`}
        method="POST"
        encType="text/plain"
        noValidate
        className="mx-auto max-w-3xl"
      >
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {contactConfig.fields.map((field) => (
            <div key={field.name} className="flex flex-col md:flex-row md:items-center md:gap-4">
              <label
                htmlFor={field.name}
                className="font-medium text-gray-700 mb-1 md:mb-0 md:w-32"
              >
                {field.label}
                {field.required && <span className="text-red-600 ml-1">*</span>}
              </label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  value={data[field.name] || ""}
                  onChange={handleChange}
                  className={`flex-1 ${errors[field.name] ? "border-red-500" : ""}`}
                />
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={data[field.name] || ""}
                  onChange={handleChange}
                  className={`flex-1 ${errors[field.name] ? "border-red-500" : ""}`}
                />
              )}
              {errors[field.name] && (
                <p className="text-red-600 text-sm mt-1 md:ml-4">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button type="submit" disabled={status.type === "submitting"}>
            Send Message
          </Button>
        </div>
        <div aria-live="polite" className="sr-only">
          {status.message}
        </div>
        {status.type === "success" && (
          <div
            role="status"
            className="max-w-md mx-auto bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center mt-6"
          >
            Thank you! {status.message}
          </div>
        )}
        {status.type === "error" && errors && !Object.keys(errors).length && (
          <div
            role="alert"
            className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg text-center mt-6"
          >
            {status.message}
          </div>
        )}
      </form>
    </section>
  );
}
