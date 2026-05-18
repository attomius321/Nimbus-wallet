import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

function manifestPlugin(browser: 'chrome' | 'firefox') {
  return {
    name: 'copy-manifest',
    closeBundle() {
      copyFileSync(
        resolve(__dirname, `public/manifest.${browser}.json`),
        resolve(__dirname, 'dist/manifest.json')
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  console.log(mode)
  const browser = mode === 'firefox' ? 'firefox' : 'chrome'
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
      manifestPlugin(browser),
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          sidepanel: resolve(__dirname, 'sidepanel.html'),
          background: resolve(__dirname, 'src/background/index.ts'),
          'content-script': resolve(__dirname, 'src/content-script/index.ts'),
          injected: resolve(__dirname, 'src/injected/index.ts'),
        },
        output: {
          // Extension scripts must land at a predictable path (no hash)
          entryFileNames: (chunk) => {
            const extensionScripts = ['background', 'content-script', 'injected']
            return extensionScripts.includes(chunk.name) ? '[name].js' : 'assets/[name]-[hash].js'
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  }
})
