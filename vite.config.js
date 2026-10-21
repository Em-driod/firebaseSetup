import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The React plugin lets Vite understand .jsx files.
export default defineConfig({
  plugins: [react()],
});
