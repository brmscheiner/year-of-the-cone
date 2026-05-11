import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';
import yaml from 'js-yaml';

function yamlEntry(fileName: string, id: string) {
  return file(fileName, {
    parser: (text) => [{ id, ...(yaml.load(text) as Record<string, unknown>) }],
  });
}

const general = defineCollection({
  loader: yamlEntry('src/content/general/index.yaml', 'config'),
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
      coneClub: z.string(),
      gofundme: z.string(),
    }),
  }),
});

const counters = defineCollection({
  loader: yamlEntry('src/content/counters/index.yaml', 'index'),
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

const inventory = defineCollection({
  loader: yamlEntry('src/content/inventory/index.yaml', 'index'),
  schema: z.object({
    items: z.array(
      z.object({
        common: z.string(),
        scientific: z.string(),
        date: z.string(),
        location: z.string(),
        notes: z.string().optional(),
        youtube: z.string().optional(),
      }),
    ),
  }),
});

export const collections = { general, counters, inventory };
