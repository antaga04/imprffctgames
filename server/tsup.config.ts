import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    outDir: 'dist',
    clean: true,
    dts: true,
    minify: true,
    sourcemap: true,
    splitting: false,
    tsconfig: './tsconfig.json',
    onSuccess: 'cp -r src/templates dist/templates',
});
