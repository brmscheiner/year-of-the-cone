import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const general = defineCollection({
  loader: file('src/content/general/index.yaml'),
  schema: z.object({
    travelerName: z.string(),
    title: z.string(),
    tagline: z.string(),
    coneCount: z.number().optional(),
    startDate: z.string(),
    currentLocation: z.string(),
    currentCountry: z.string(),
    socialLinks: z.object({
      instagram: z.string(),
      tiktok: z.string(),
      youtube: z.string(),
      patreon: z.string(),
      substack: z.string(),
      gofundme: z.string(),
    }),
  }),
});

const counters = defineCollection({
  loader: file('src/content/counters/index.yaml'),
  schema: z.object({
    items: z.array(
      z.object({
        label: z.string(),
        value: z.number(),
        icon: z.string().optional(),
      }),
    ),
  }),
});

export const collections = { general, counters };
