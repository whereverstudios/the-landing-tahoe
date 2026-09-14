/**
 * Top-level navigation for The Landing. Links are relative to the site root;
 * components prefix them with the configured base via `url()` from src/js/paths.ts.
 */
import { type navItem } from "../types/configDataTypes";

const navConfig: navItem[] = [
  { text: "Stay", link: "/stay/" },
  { text: "Dine", link: "/dine/" },
  { text: "Spa", link: "/spa/" },
  { text: "Play", link: "/activities/" },
  { text: "Gather", link: "/gather/" },
  { text: "Offers", link: "/offers/" },
];

export default navConfig;
