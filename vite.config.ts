import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
const page = (f: string) => fileURLToPath(new URL('./' + f, import.meta.url))
export default defineConfig({ plugins: [react()], build: { rollupOptions: { input: {
        'home': page('index.html'),
        'about': page('about.html'),
        'privacy-policy': page('privacy-policy.html'),
        'contact': page('contact.html'),
        'yes-or-no-wheel': page('yes-or-no-wheel.html'),
        'flip-a-coin': page('flip-a-coin.html'),
        'random-number-generator': page('random-number-generator.html'),
        'what-to-eat-wheel': page('what-to-eat-wheel.html'),
        'team-picker': page('team-picker.html')
} } } })
