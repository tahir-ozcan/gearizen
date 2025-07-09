// app/contact/contact-client.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

export default function ContactClient() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  function validate() {
    const errs: Partial<typeof formData> = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) errs.message = "Message is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    if (!validate()) {
      e.preventDefault();
      return;
    }
    // allow native form submit to Formspree
  }

  return (
    <section
      id="contact-gearizen"
      aria-labelledby="contact-heading"
      className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 text-gray-900 antialiased"
    >
      <h1
        id="contact-heading"
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 tracking-tight text-center"
      >
        Contact Us
      </h1>
      <p className="text-lg text-gray-700 mb-12 max-w-xl mx-auto leading-relaxed text-center">
        Have questions, feedback or tool suggestions? Send us a message and we&#39;ll get back to you shortly.
      </p>

      {success ? (
        <div
          role="status"
          className="max-w-md mx-auto bg-green-50 border border-green-200 text-green-800 p-6 rounded-lg text-center"
        >
          <p className="font-medium text-lg">Thank you! Your message has been sent.</p>
        </div>
      ) : (
        <form
          ref={formRef}
          action="https://formspree.io/f/xwpbdrlj"
          method="POST"
          noValidate
          onSubmit={handleSubmit}
          className="max-w-md mx-auto space-y-6"
        >
          {/* redirect back with success=1 */}
          <input
            type="hidden"
            name="_next"
            value="https://gearizen.com/contact?success=1"
          />

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className={`w-full border rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "error-name" : undefined}
            />
            {errors.name && (
              <p id="error-name" className="mt-1 text-sm text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className={`w-full border rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "error-email" : undefined}
            />
            {errors.email && (
              <p id="error-email" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              required
              className={`w-full border rounded-lg px-4 py-2 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 transition ${
                errors.message
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "error-message" : undefined}
            />
            {errors.message && (
              <p id="error-message" className="mt-1 text-sm text-red-600">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full inline-flex justify-center items-center bg-indigo-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            Send Message
          </button>
        </form>
      )}
    </section>
  );
}