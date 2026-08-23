import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "normalize-windows-paths",
      enforce: "post",
      transform(code, id) {
        if (id && id.includes("?html-proxy")) {
          return { code: code.replace(/\\/g, "/"), map: null };
        }
        return null;
      },
      transformIndexHtml(html) {
        // normalize any backslashes if present in injected proxy URLs
        return html.replace(/\\/g, "/");
      },
    },
  ],
});