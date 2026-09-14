/**
 * * Configuration of the i18n system data files and text translations
 * The Landing ships in English only; the structure is kept so a second locale can be added later.
 */
import navDataEn from "./en/navData.json";
import siteDataEn from "./en/siteData.json";

export const dataTranslations = {
  en: {
    siteData: siteDataEn,
    navData: navDataEn,
  },
} as const;

export const textTranslations = {
  en: {
    back_to_all_posts: "Back to all posts",
    updated: "Updated",
  },
} as const;

export const routeTranslations = {
  en: {
    stayKey: "stay",
    dineKey: "dine",
    spaKey: "spa",
    activitiesKey: "activities",
    gatherKey: "gather",
    offersKey: "offers",
  },
} as const;

export const localizedCollections = {} as const;
