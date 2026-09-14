import { type SiteDataProps } from "../types/configDataTypes";

const siteData: SiteDataProps = {
  name: "The Landing",
  title: "The Landing Resort & Spa | Lakefront Hotel in South Lake Tahoe",
  description:
    "The Landing Resort & Spa is a lakefront resort on Lake Tahoe's south shore: 82 rooms and suites with stone fireplaces, Lakeside Dining, a full-service spa, and Heavenly Village three blocks away. Book direct for a $50 daily resort credit.",

  author: {
    name: "The Landing Resort & Spa",
    email: "reservations@thelandingtahoe.com",
    twitter: "thelandingtahoe",
  },

  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/the-landing-tahoe/og.jpg",
    alt: "Lake Tahoe's south shore in front of The Landing Resort & Spa",
  },
};

export default siteData;
