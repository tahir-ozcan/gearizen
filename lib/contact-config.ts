import configJson from './contact-config.json';

export interface ContactChannel {
  type: 'email' | 'link';
  label: string;
  icon: string;
  address?: string; // base64 encoded for email
  href?: string;    // for link type
}

export interface ContactFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  required?: boolean;
}

export interface ContactConfig {
  channels: ContactChannel[];
  form: {
    endpoint?: string;
    fields: ContactFormField[];
  };
}

export default configJson as ContactConfig;
