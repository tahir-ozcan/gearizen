import data from './contact-config.json';

export interface ContactFormField {
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
  emails: string[];
  social: ContactChannel[];
  formFields: ContactFormField[];
}

const contactConfig = data as ContactConfig;
export default contactConfig;
