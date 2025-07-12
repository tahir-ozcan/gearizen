export interface ContactField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  required?: boolean;
}

export interface ContactChannel {
  label: string;
  href: string;
  icon: string;
}

export interface ContactConfig {
  encodedEmail: string;
  channels: ContactChannel[];
  fields: ContactField[];
}

export const contactConfig: ContactConfig = {
  encodedEmail: 'Z2Vhcml6ZW4udGFoaXIub3pjYW5AZ21haWwuY29t',
  channels: [
    {
      label: 'GitHub',
      href: 'https://github.com/tahir-ozcan/gearizen',
      icon: 'FaGithub',
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com/gearizen',
      icon: 'FaTwitter',
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/company/gearizen',
      icon: 'FaLinkedin',
    },
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
  ],
};

export function decodeEmail(encoded: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(encoded, 'base64').toString('utf-8');
  }
  try {
    return atob(encoded);
  } catch {
    return '';
  }
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateContact(
  data: Record<string, string>,
  fields: ContactField[] = contactConfig.fields,
): ValidationErrors {
  const errors: ValidationErrors = {};
  fields.forEach(f => {
    if (f.required && !data[f.name]?.trim()) {
      errors[f.name] = 'Required';
    }
  });
  const email = data.email ?? '';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Invalid email';
  }
  return errors;
}

export async function sendContactForm(
  data: Record<string, string>,
): Promise<void> {
  const email = decodeEmail(contactConfig.encodedEmail);
  const subject = `Message from ${data.name ?? ''}`;
  const body = `${data.message ?? ''}\n\nFrom: ${data.name ?? ''}\nEmail: ${data.email ?? ''}`;
  const href =
    `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
  await new Promise(res => setTimeout(res, 300));
}
