import type { MetadataRoute } from "next";
import { at_origin, site_origin } from "@/lib/site_origin";

const search_engines = [
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  "Qwantbot",
  "Qwantify",
  "Slurp",
  "YandexBot",
];

const ai_training_crawlers = [
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
  "FacebookBot",
  "CCBot",
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
  "cohere-training-data-crawler",
  "Diffbot",
  "Ai2Bot",
  "Timpibot",
  "Omgilibot",
];

const ai_search_crawlers = [
  "OAI-SearchBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "DuckAssistBot",
  "Meta-ExternalFetcher",
  "YouBot",
  "PetalBot",
];

const user_triggered_agents = [
  "ChatGPT-User",
  "Claude-User",
  "Perplexity-User",
  "MistralAI-User",
];

const link_previewers = [
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "WhatsApp",
  "TelegramBot",
  "Discordbot",
  "Slackbot-LinkExpanding",
];

const seo_tools = ["AhrefsBot", "SemrushBot"];

const robots = (): MetadataRoute.Robots => ({
  rules: [
    search_engines,
    ai_training_crawlers,
    ai_search_crawlers,
    user_triggered_agents,
    link_previewers,
    seo_tools,
    "*",
  ].map((userAgent) => ({ userAgent, allow: "/" })),
  host: site_origin.origin,
  sitemap: at_origin("/sitemap.xml"),
});

export default robots;
