"use client";
import { FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import { LucideProps } from "lucide-react";
import contactConfig from "@/lib/contact-config";
import { validateForm, submitForm } from "@/lib/contact-form";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";

const iconCache: Record<string, React.ComponentType<LucideProps>> = {};
function getIcon(name: string) {
  if (!iconCache[name]) {
    iconCache[name] = dynamic<LucideProps>(
      () =>
        import("lucide-react").then((m) => ({
          default: (m as unknown as Record<string, React.ComponentType<LucideProps>>)[name],
        })),
      { ssr: false }
    );
  }
  return iconCache[name];
}

export default function ContactClient() {
  const { channels, form } = contactConfig;
  const emailAddress = channels.find((c) => c.type === "email")?.address
    ? atob(channels.find((c) => c.type === "email")!.address!)
    : "";

  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateForm(values, form.fields);
    setErrors(validation.errors);
    if (!validation.valid) return;
    try {
      await submitForm(values, contactConfig);
      setStatus("success");
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
      <p className="text-lg text-gray-700 mb-8 max-w-xl mx-auto text-center">
        Have questions or feedback? Reach us via the channels below or send a message.
      </p>

      <ul className="flex justify-center space-x-6 mb-12">
        {channels.map((channel) => {
          const Icon = getIcon(channel.icon);
          const href = channel.type === "email" ? `mailto:${atob(channel.address ?? "")}` : channel.href ?? "";
          const target = channel.type === "link" ? "_blank" : undefined;
          return (
            <li key={channel.label}>
              <a
                href={href}
                target={target}
                rel={target ? "noopener noreferrer" : undefined}
                aria-label={channel.label}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded transition-colors"
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>

      <form
        onSubmit={handleSubmit}
        action={`mailto:${emailAddress}`}
        method="post"
        className="max-w-3xl mx-auto grid gap-6 md:grid-cols-[auto_1fr] lg:grid-cols-2"
        noValidate
      >
        {form.fields.map((field) => (
          <div key={field.name} className="flex flex-col md:flex-row md:items-center md:gap-4">
            <label htmlFor={field.name} className="font-medium md:w-32">
              {field.label}
              {field.required && (
                <span className="text-red-600 ml-0.5" aria-hidden="true">
                  *
                </span>
              )}
            </label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.name}
                name={field.name}
                required={field.required}
                value={values[field.name] || ""}
                onChange={handleChange}
                className="flex-1"
              />
            ) : (
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                required={field.required}
                value={values[field.name] || ""}
                onChange={handleChange}
                className="flex-1"
              />
            )}
            {errors[field.name] && (
              <p className="text-sm text-red-600 mt-1 md:ml-32" role="alert">
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
        <div className="md:col-span-2 lg:col-span-2">
          <Button type="submit" className="w-full">
            Send Message
          </Button>
          <div aria-live="polite" className="mt-4 min-h-[1.5rem]">
            {status === "success" && (
              <p className="text-green-700" role="status">
                Thank you! Your message has been prepared in your email client.
              </p>
            )}
            {status === "error" && (
              <p className="text-red-600" role="alert">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
