export type BlogPostListItem = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  language: string;
  author: string;
  coverImageUrl?: string;
};

export type BlogPost = {
  _id: string;
  _updatedAt?: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  content?: any;
  publishedAt: string;
  language: string;
  seo?: {
    title?: string;
    description?: string;
    noIndex?: boolean;
    ogTitle?: string;
    ogDescription?: string;
    imageUrl?: string;
  };
  faqs?: Array<{ question: string; answer: string }>;
  howTo?: {
    name?: string;
    description?: string;
    steps?: Array<{ name?: string; text?: string }>;
  };
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  keywords?: string[];
  author: {
    name: string;
    role?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
    image?: string;
  };
  coverImageUrl?: string;
};

