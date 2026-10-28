import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import sassDts from 'vite-plugin-sass-dts'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        sassDts({
            formatter: 'biome',
            esmExport: true
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    test: {
        environment: 'node',
        include: ['src/**/*.test.ts']
    }
})
