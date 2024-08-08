import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// GitHub Pagesのリポジトリのサブディレクトリでホストする場合のベースパス設定
export default defineConfig({
  plugins: [svelte()],
  base: '/app1/', // リポジトリ名に置き換えてください
  build: {
    outDir: '.', // ルートディレクトリに出力
    rollupOptions: {
      input: {
        main: 'index.html' // ルートのindex.htmlを入力ファイルに指定
      }
    }
  }
});