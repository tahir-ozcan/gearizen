import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  plugins: [
    ['@tailwindcss/postcss', { config: `${__dirname}/tailwind.config.js` }],
    'autoprefixer',
  ],
};

export default config;
