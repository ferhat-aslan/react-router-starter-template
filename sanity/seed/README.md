# Seed example blog content

This folder contains importable demo content you can load into your Sanity dataset using the Sanity CLI configured in the repo root (`sanity.cli.ts`).

## Import (Sanity CLI)

1. Login (once):
   - `npx sanity login`

2. Import the example documents:
   - `npx sanity dataset import sanity/seed/example-blog.ndjson production`

This creates:
- `author.exampleKleinbyte`
- `blogPost.example.welcomeToKleinbyte` (slug: `welcome-to-kleinbyte`)

Then open your app blog page:
- `/blog`
- `/blog/welcome-to-kleinbyte`
