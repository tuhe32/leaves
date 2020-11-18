import type { DenonConfig } from "https://deno.land/x/denon/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "test/server.ts",
      desc: "Run oak instance",
      allow: ["env", "net", "read"],
      "tsconfig": "tsconfig.json",
      "unstable": true,
      env: {
        PORT: "9001",
      },
    },
  },
};

export default config;
