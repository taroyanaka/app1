import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/

export default defineConfig({
  // base: '/your-repo-name/', // リポジトリ名に置き換えてください
//  base: 'https://taroyanaka.github.io/app1/', // リポジトリ名に置き換えてください
  base: '/app1/', // リポジトリ名に置き換えてください
  plugins: [svelte()]
});