import { defineField, defineType } from 'sanity'

export const howToStep = defineType({
    name: 'howToStep',
    title: 'How-To Step',
    type: 'object',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'text',
            title: 'Text',
            type: 'text',
            rows: 3,
        }),
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'text',
        },
        prepare({ title, subtitle }) {
            return {
                title: title || 'Step',
                subtitle: subtitle ? String(subtitle).slice(0, 80) : undefined,
            }
        },
    },
})

export default defineType({
    name: 'howTo',
    title: 'How-To',
    type: 'object',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'steps',
            title: 'Steps',
            type: 'array',
            of: [{ type: 'howToStep' }],
        }),
    ],
})

