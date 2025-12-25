import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

// Sanity client configuration
// This file is only imported by blog routes, keeping bundle size minimal for other pages
export const sanityClient = createClient({
  projectId: '7g9hg49b', // Kleinbyte Blog project ID
  dataset: 'production',
  apiVersion: '2024-11-28',
  useCdn: true, // Use CDN for faster response times
});

// Image URL builder for Sanity CDN images
const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// GROQ query to fetch all published blog posts
export const allPostsQuery = `*[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  language,
  "author": author->name,
  "coverImage": coverImage.asset->url
}`;

// GROQ query to fetch a single blog post by slug
export const postBySlugQuery = (slug: string) => `*[_type == "blogPost" && slug.current == "${slug}" && !(_id in path("drafts.**"))][0] {
  _id,
  title,
  slug,
  excerpt,
  content,
  publishedAt,
  language,
  seoTitle,
  seoDescription,
  "ogImage": ogImage.asset->url,
  keywords,
  "author": author->{
    name,
    role,
    twitter,
    linkedin,
    website,
    "image": image.asset->url
  },
  "coverImage": coverImage.asset->url
}`;

// TypeScript types for blog posts
export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  content?: any; // Portable text content
  publishedAt: string;
  language: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  keywords?: string[];
  author: {
    name: string;
    role?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
    image?: string;
  };
  coverImage?: string;
}
