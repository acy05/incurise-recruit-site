/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RECRUIT_WPCF7_ENDPOINT?: string;
  readonly VITE_RECRUIT_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
