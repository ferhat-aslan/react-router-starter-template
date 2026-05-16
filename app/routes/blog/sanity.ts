// Deprecated module: kept for existing imports.
// Prefer:
// - `./sanity.server` for server-side fetching
// - `./sanity-queries` for GROQ query strings
// - `./types` for TS types (no @sanity deps)
export { sanityClient } from "./sanity.server";
export {
  allPostsQuery,
  blogPostsCountQuery,
  blogPostsPageQuery,
  postBySlugQuery,
  similarPostsQuery,
} from "./sanity-queries";
export type { BlogPost, BlogPostListItem } from "./types";
