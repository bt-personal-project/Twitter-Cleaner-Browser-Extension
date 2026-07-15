import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
    manifest_version: 3,
    name: "Twitter 2077",
    version: "1.0.0",
    description: "Remove retweets and likes from Twitter/X",

    icons: {
        16: "icons/icon16.png",
        32: "icons/icon32.png",
        48: "icons/icon48.png",
        120: "icons/icon120.png",
    },

    permissions: ["activeTab", "storage"],

    host_permissions: [
        "https://x.com/*",
        "https://twitter.com/*",
    ],

    action: {
        default_popup: "src/popup/index.html",
        default_icon: {
            16: "icons/icon16.png",
            32: "icons/icon32.png",
        },
    },

    background: {
        service_worker: "src/background/index.ts",
        type: "module",
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
})