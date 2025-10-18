import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      __APP_ENV__: JSON.stringify(env.ENVIRONMENT),
      __SERVER_URL__: JSON.stringify(env.SERVER_URL)
    },
    server: {
      port: env.SERVER_PORT,
      strictPort: true,
      open: true,
      proxy: {
        "/api": env.SERVER_URL,
      },
    },
  };
})
