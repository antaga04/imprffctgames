import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: 'dist',
    sourcemap: true,
    clean: true,
    dts: true,
    esbuildOptions(options) {
        options.alias = {
            '@': './src',
            '@/models': 'src/api/models',
            '@/routes': 'src/api/routes',
            '@/controllers': 'src/api/controllers',
            '@/validations': 'src/api/validations',
        };
    },
});
