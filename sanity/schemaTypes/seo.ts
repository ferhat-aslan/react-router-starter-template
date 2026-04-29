import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'seo',
    title: 'SEO',
    type: 'object',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            description: 'Overrides the default page title (recommended ≤ 60–70 chars).',
            validation: (Rule) => Rule.max(70),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
            description: 'Meta description (recommended ≤ 150–160 chars).',
            validation: (Rule) => Rule.max(160),
        }),
        defineField({
            name: 'noIndex',
            title: 'No Index',
            type: 'boolean',
            description: 'Prevent indexing by search engines for this page.',
            initialValue: false,
        }),
        defineField({
            name: 'ogTitle',
            title: 'OpenGraph Title',
            type: 'string',
            validation: (Rule) => Rule.max(70),
        }),
        defineField({
            name: 'ogDescription',
            title: 'OpenGraph Description',
            type: 'text',
            rows: 2,
            validation: (Rule) => Rule.max(160),
        }),
        defineField({
            name: 'image',
            title: 'OpenGraph Image',
            type: 'image',
            options: { hotspot: true },
            description: 'Social sharing image (1200×630 recommended).',
        }),
    ],
})
