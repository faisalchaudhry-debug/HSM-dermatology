
export interface Testimonial {
  name: string;
  date: string;
  content: string;
  rating: number;
}

export interface TeamMember {
  name: string;
  title: string;
  description: string;
  image: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Treatment {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  considerations: string[];
  image: string;
}

declare global {
  interface Window {
    dataLayer: any[];
  }
}
