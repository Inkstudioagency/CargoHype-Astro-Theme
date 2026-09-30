// @ts-check
import { defineConfig } from 'astro/config';
import config from './src/config/config.json' with { type: 'json' };

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
