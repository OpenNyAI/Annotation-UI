/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TALLY_FORM_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
