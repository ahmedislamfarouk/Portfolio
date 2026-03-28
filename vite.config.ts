import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Portfolio/',
  server: {
    watch: {
      ignored: ['**/.agent/**', '**/.claude/**', '**/.codebuddy/**', '**/.codex/**', '**/.continue/**', '**/.cursor/**', '**/.gemini/**', '**/.github/**', '**/.kiro/**', '**/.opencode/**', '**/.qoder/**', '**/.qwen/**', '**/.roo/**', '**/.trae/**', '**/.windsurf/**'],
    },
  },
})
