import { defineField, defineType } from 'sanity'

export const ctaButton = defineType({
    name: 'ctaButton',
    title: 'CTA Button',
    type: 'object',
    fields: [
        defineField({
            name: 'label',
            title: 'Label',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'href',
            title: 'Link',
            type: 'url',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'variant',
            title: 'Variant',
            type: 'string',
            options: {
                list: [
                    { title: 'Primary', value: 'primary' },
                    { title: 'Secondary', value: 'secondary' },
                    { title: 'WhatsApp', value: 'whatsapp' },
                ],
            },
            initialValue: 'primary',
        }),
    ],
    preview: {
        select: {
            title: 'label',
            subtitle: 'href',
        },
    },
})

export default defineType({
    name: 'cta',
    title: 'Call To Action',
    type: 'object',
    fields: [
        defineField({
            name: 'eyebrow',
            title: 'Eyebrow',
            type: 'string',
        }),
        defineField({
            name: 'headline',
            title: 'Headline',
            type: 'string',
        }),
        defineField({
            name: 'text',
            title: 'Text',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'buttons',
            title: 'Buttons',
            type: 'array',
            of: [{ type: 'ctaButton' }],
            validation: (Rule) => Rule.max(2),
        }),
    ],
})

