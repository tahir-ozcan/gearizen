// app/contact/contact-client.tsx

export default function ContactClient() {
  return (
    <section
      id="contact-gearizen"
      aria-labelledby="contact-heading"
      className="space-y-20 text-gray-900 antialiased"
    >
      {/* Hero / Heading */}
      <div className="text-center space-y-6 sm:px-0">
        <h1
          id="contact-heading"
          className="
            bg-clip-text text-transparent
            bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]
            text-4xl sm:text-5xl md:text-6xl
            font-extrabold tracking-tight
          "
        >
          Contact Us
        </h1>
        <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-[#7c3aed] via-[#ec4899] to-[#fbbf24]" />
        <p className="mx-auto max-w-xl text-base sm:text-lg text-gray-700 leading-relaxed">
          Have questions or feedback? Please email us at{" "}
          <a
            href="mailto:gearizen.tahir.ozcan@gmail.com"
            className="text-[#7c3aed] hover:text-[#8b5cf6] underline transition-colors"
          >
            gearizen.tahir.ozcan@gmail.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}