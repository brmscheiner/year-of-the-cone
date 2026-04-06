import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

// Single-entry collections: the YAML files are arrays with one object each.
// Astro 6's file loader requires an array of objects with unique `id` fields.

const general = defineCollection({
  loader: file('src/content/general/index.yaml'),
  schema: z.object({
    travelerName: z.string(),
    title: z.string(),
    tagline: z.string(),
    startDate: z.string(),
    currentLocation: z.string(),
    currentCountry: z.string(),
  }),
});

const counters = defineCollection({
  loader: file('src/content/counters/index.yaml'),
  schema: z.object({
    items: z.array(
      z.object({
        label: z.string(),
        value: z.number(),
        icon: z.string(),
      }),
    ),
  }),
});

export const collections = { general, counters };
