import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// This source build is isolated from the published repository root.
export default defineConfig({ base: './', plugins: [react()], build: { outDir: 'dist', emptyOutDir: true, target: 'es2022' } })
