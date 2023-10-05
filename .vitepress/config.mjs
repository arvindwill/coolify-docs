import { defineConfig } from "vitepress";
const config = {
  title: "Coolify",
  description: "Coolify Documentation",
  lastUpdated: true,
  lang: "en-US",
  base: "/docs/",
  cleanUrls: true,
  head: [],
  themeConfig: {
    outline: "deep",
    search: {
      provider: 'local'
    },
    logo: "/coolify-transparent.png",
    nav: [
      {
        text: "Other Products",
        items: [
          { text: "Safetyper", link: "https://safetyper.com" },
          { text: "Fonts", link: "https://fonts.coollabs.io" },
        ],
      },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is Coolify?", link: "/" },
          { text: "Contact", link: "/contact" },
        ],
      },
      {
        text: "Get Started",
        items: [
          { text: "Installation", link: "/installation" },
          {
            text: "Building Blocks",
            link: "/building-blocks",
          },
          {
            text: "No Vendor Lock-in",
            link: "/no-vendor-lock-in",
          },
          {
            text: "Firewall",
            link: "/firewall",
          },
          {
            text: "Password Reset",
            link: "/password-reset",
          },
        ],
      },
      {
        text: "Deep Dive",
        items: [
          { text: "Servers", link: "/servers" },
          { text: "Proxy", link: "/proxy" },
          { text: "Applications", link: "/applications" },
          { text: "Commands", link: "/commands" },
          { text: "Service Templates", link: "/service-templates" },
          { text: "Domains", link: "/domains" },
          { text: "Environment Variables", link: "/environment-variables" },
          { text: "Persistent Storage", link: "/persistent-storage" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/coollabsio/coolify" },
      { icon: "twitter", link: "https://twitter.com/heyandras" },
      { icon: "discord", link: "https://coollabs.io/discord" },
      { icon: "mastodon", link: "https://fosstodon.org/@andrasbacsai" },
    ],
  },
};
if (process.env.NODE_ENV !== "development") {
  config.head.push([
    "script",
    {
      defer: "",
      src: "https://analytics.coollabs.io/js/plausible.js",
      "data-domain": "coolify.io/docs",
    },
  ]);
}

export default defineConfig(config);
