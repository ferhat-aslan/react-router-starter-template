import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { schemaTypes } from './sanity/schemaTypes'
import { table } from '@sanity/table';

export default defineConfig({
  name: 'default',
  title: 'Kleinbyte Blog',

  projectId: '7g9hg49b',
  dataset: 'production',

  plugins: [structureTool(),  table()],

  schema: {
    types: schemaTypes as any,
  },
})
