export interface SocialLink {
  label: string;
  href: string;
  icon: string; // icon name from react-icons/fa
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  required?: boolean;
}

export interface ContactConfig {
  email: string; // base64 encoded
  socialLinks: SocialLink[];
  formFields: FormField[];
}

const contactConfig: ContactConfig = {
  email: 'Z2Vhcml6ZW4udGFoaXIub3pjYW5AZ21haWwuY29t',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/tahir-ozcan/gearizen', icon: 'FaGithub' },
    { label: 'Twitter', href: 'https://twitter.com/gearizen', icon: 'FaTwitter' },
    { label: 'LinkedIn', href: 'https://linkedin.com/company/gearizen', icon: 'FaLinkedin' }
  ],
  formFields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'message', label: 'Message', type: 'textarea', required: true }
  ]
};

export default contactConfig;
