import { defineConfig } from 'vite';
import svelte from '@sveltejs/vite-plugin-svelte';

// GitHub Pagesのルートでホストする場合のベースパス設定
export default defineConfig({
  base: '/', // ルートパス
  plugins: [svelte()],
  build: {
    outDir: 'dist' // デフォルトのビルド出力先
  }
});
