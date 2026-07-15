import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Twitter 2077",
  version: "1.0.0",

  permissions: ["activeTab", "storage"],

  host_permissions: [
    "https://x.com/*",
    "https://twitter.com/*",
  ],

  action: {
    default_popup: "src/popup/index.html",
  },

  background: {
    scripts: ["src/background/index.ts"],
  },

  browser_specific_settings: {
    gecko: {
      id: "twitter2077@example.com",
    },
  },

  content_scripts: [
    {
      matches: [
        "https://x.com/*",
        "https://twitter.com/*",
      ],
      js: ["src/content/index.ts"],
    },
  ],
});