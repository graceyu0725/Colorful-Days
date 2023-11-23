import react from '@vitejs/plugin-react';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), Icons({ compiler: 'jsx', jsx: 'react' })],
  };
});
