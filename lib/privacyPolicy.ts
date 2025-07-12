import policy from '../app/privacy/privacy-policy.json';

export interface PolicySection {
  id: string;
  title: string;
  content: string;
}

export function getPrivacyPolicySections(): PolicySection[] {
  return (policy as PolicySection[]).map((section) => ({
    id: section.id,
    title: section.title,
    content: section.content,
  }));
}
