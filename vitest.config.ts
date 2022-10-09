import { defineConfig } from "vitest/config"
import path  from "path";

export default defineConfig({
  test: {
    globals: true
  },
  resolve: {
    alias:[
      {
        find: /@mini-vue3\/([\w-]*)/,
        replacement: path.resolve(__dirname, "src") + "/$1/src"
      }
    ]
  }
})
