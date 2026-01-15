import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'
import { table } from '@sanity/table';

export default defineConfig({
  name: 'default',
  title: 'Kleinbyte Blog',

  projectId: '7g9hg49b',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), table()],

  schema: {
    types: schemaTypes,
  },
})
