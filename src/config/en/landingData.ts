/**
 * Content for The Landing. Photography is the resort's own, pulled from thelandingtahoe.com.
 */
import type { ImageMetadata } from "astro";

import actBeach from "@images/landing/act-beach.jpg";
import actBiking from "@images/landing/act-biking.jpg";
import actCruise from "@images/landing/act-cruise.jpg";
import actFishing from "@images/landing/act-fishing.jpg";
import actGolf from "@images/landing/act-golf.jpg";
import actHiking from "@images/landing/act-hiking.jpg";
import actHorse from "@images/landing/act-horse.jpg";
import actSki from "@images/landing/act-ski.jpg";
import actSnowboard from "@images/landing/act-snowboard.jpg";
import actSnowmobile from "@images/landing/act-snowmobile.jpg";
import actSnowshoe from "@images/landing/act-snowshoe.jpg";
import actTube from "@images/landing/act-tube.jpg";
import actWater from "@images/landing/act-water.jpg";
import gatherBallroom from "@images/landing/gather-ballroom.jpg";
import gatherBoardroom from "@images/landing/gather-boardroom.jpg";
import gatherRooftop from "@images/landing/gather-rooftop.jpg";
import lifeSmores from "@images/landing/life-smores.jpg";
import room1br from "@images/landing/room-1br-living.jpg";
import room3br from "@images/landing/room-3br.jpg";
import roomBalcony from "@images/landing/room-balcony.jpg";
import roomKing2 from "@images/landing/room-king2.jpg";
import roomLakefrontStudio from "@images/landing/room-lakefront-studio.jpg";
import roomLakeviewKing from "@images/landing/room-lakeview-king.jpg";
import roomSuperiorKing from "@images/landing/room-superior-king.jpg";
import spaRobes from "@images/landing/spa-robes.jpg";

export const BOOKING_URL = "https://www.thelandingtahoe.com/book/";
export const PHONES = {
  reservations: { display: "855.700.5263", href: "tel:+18557005263" },
  frontDesk: { display: "530.541.5263", href: "tel:+15305415263" },
  spa: { display: "530.600.3509", href: "tel:+15306003509" },
};

export interface Room {
  kind: "Guest room" | "Premier" | "Suite";
  name: string;
  blurb: string;
  image: ImageMetadata;
  facts: { k: string; v: string }[];
}

export const rooms: Room[] = [
  {
    kind: "Guest room",
    name: "Standard King",
    blurb: "A cozy retreat on the first to third floors with a stone gas fireplace and heated bathroom floors. Anything but standard.",
    image: roomSuperiorKing,
    facts: [{ k: "Sleeps", v: "2" }, { k: "Bed", v: "1 King" }, { k: "Size", v: "260 sq ft" }],
  },
  {
    kind: "Guest room",
    name: "Gardenview King",
    blurb: "A corner room wrapped in forest views, with room to spread out after a day on the trail.",
    image: roomKing2,
    facts: [{ k: "Sleeps", v: "2" }, { k: "Bed", v: "1 King" }, { k: "Size", v: "390 sq ft" }],
  },
  {
    kind: "Guest room",
    name: "Lakeview King",
    blurb: "The lake, guaranteed. Wake up to the water and finish the day by the fire with the balcony door open.",
    image: roomLakeviewKing,
    facts: [{ k: "Sleeps", v: "2" }, { k: "Bed", v: "1 King" }, { k: "View", v: "Lake" }],
  },
  {
    kind: "Premier",
    name: "Premier Two Queens",
    blurb: "Two queens, a bathtub and a private balcony. The room to book for families and friends who want the view.",
    image: roomBalcony,
    facts: [{ k: "Sleeps", v: "4" }, { k: "Bed", v: "2 Queens" }, { k: "Extras", v: "Tub, balcony" }],
  },
  {
    kind: "Suite",
    name: "Premier Lakefront Studio",
    blurb: "An oversized balcony facing straight out at the water and the mountains, with a fireplace and a seating area.",
    image: roomLakefrontStudio,
    facts: [{ k: "Sleeps", v: "2" }, { k: "Bed", v: "1 Cal King" }, { k: "Size", v: "480 sq ft" }],
  },
  {
    kind: "Suite",
    name: "One-Bedroom Lakefront Suite",
    blurb: "Over a thousand square feet with a large private patio, a private bar and a separate dining area.",
    image: room1br,
    facts: [{ k: "Sleeps", v: "2" }, { k: "Bed", v: "1 King" }, { k: "Size", v: "1,065 sq ft" }],
  },
  {
    kind: "Suite",
    name: "Three-Bedroom Suite with Kitchen",
    blurb: "Three bedrooms, two baths, a living room, full kitchen and patio. Built for families and wedding parties.",
    image: room3br,
    facts: [{ k: "Sleeps", v: "6" }, { k: "Beds", v: "2 K + 1 Q" }, { k: "Size", v: "890 sq ft" }],
  },
];

export const inRoomAmenities = [
  "Stone gas fireplace in every room",
  "Heated bathroom floors and heated toilet seats",
  "European rain showers",
  "Lavazza espresso machine",
  "Plush pillow-top bed, terry robes and slippers",
  "55-inch HD TV and high-speed Wi-Fi",
  "Private balcony or patio",
  "Dog-friendly rooms available",
];

export const resortAmenities = [
  "Heated outdoor pool and hot tub, with ADA chair and lift",
  "Full-service spa and fitness center",
  "Two passes a day to privately owned Lakeside Beach",
  "Lakeview patio with fire pits and a rooftop deck with fireplace",
  "1,500-bottle wine vault and a granite and onyx bar",
  "Complimentary bicycle rentals, offered seasonally",
  "Complimentary local shuttle",
  "Ski services in winter",
  "Self or valet parking, $30 per night",
  "Sundries shop and dry cleaning",
];

export interface Offer {
  name: string;
  detail: string;
  tag: string;
  value: string;
  href: string;
  featured?: boolean;
}

export const offers: Offer[] = [
  { name: "Book direct: $50 daily credit", detail: "Reserve on this site and receive a $50 daily resort credit to spend at the spa or Lakeside Dining.", tag: "Featured · Direct", value: "$50/day", href: "https://www.thelandingtahoe.com/offers/50-daily-credit/", featured: true },
  { name: "Autumn by the Lake", detail: "Stay two or more nights in a Premier room or higher and receive a $100 resort credit.", tag: "Stay & dine · Seasonal", value: "$100", href: "https://www.thelandingtahoe.com/offers/autumn-by-the-lake/" },
  { name: "Stay Longer & Save", detail: "Save up to 20% when you linger a little longer.", tag: "Stay", value: "−20%", href: "https://www.thelandingtahoe.com/offers/stay-more-save-more/" },
  { name: "Midweek Special", detail: "Up to 20% off the best available rate when you arrive Sunday through Thursday.", tag: "Stay · Package", value: "−20%", href: "https://www.thelandingtahoe.com/offers/" },
  { name: "Perks for Planning Ahead", detail: "Book early and save up to 20% on rooms and suites.", tag: "Stay · Advance", value: "−20%", href: "https://www.thelandingtahoe.com/offers/" },
  { name: "Dine & Stay", detail: "Stay two nights or more and receive a $40 daily dining credit at Lakeside Dining.", tag: "Stay & dine", value: "$40/day", href: "https://www.thelandingtahoe.com/offers/" },
  { name: "The Suite Life", detail: "Two or more nights in a suite earns a $75 daily resort credit for the spa or dining.", tag: "Suites", value: "$75/day", href: "https://www.thelandingtahoe.com/offers/" },
  { name: "Tahoe Staycation", detail: "For California and Nevada neighbors: up to 20% off the best available rate.", tag: "Local residents", value: "−20%", href: "https://www.thelandingtahoe.com/offers/tahoe-staycation/" },
  { name: "AAA Member Rate", detail: "Members receive up to 15% off the best available rate.", tag: "Discounted rate", value: "−15%", href: "https://www.thelandingtahoe.com/offers/" },
];

export interface Activity {
  season: "summer" | "winter";
  label: string;
  name: string;
  blurb: string;
  image: ImageMetadata;
  href: string;
}

export const activities: Activity[] = [
  { season: "summer", label: "Steps away", name: "Lakeside Beach", blurb: "Two passes a day are included with your stay.", image: actBeach, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "summer", label: "Marina", name: "Water sports", blurb: "Boating, kayaks, paddleboards, wakeboarding and lessons for beginners.", image: actWater, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "summer", label: "800+ trailheads", name: "Hiking", blurb: "From scenic day hikes to rugged excursions above the lake.", image: actHiking, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "summer", label: "Complimentary bikes", name: "Biking", blurb: "Paved paths, single track and the Flume Trail on the east shore.", image: actBiking, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "summer", label: "Stream & lake", name: "Fishing", blurb: "Fly fishing on the streams or a chartered day on the lake.", image: actFishing, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "summer", label: "High-altitude", name: "Golf", blurb: "Thin air adds distance to your drive on courses with jaw-dropping views.", image: actGolf, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "summer", label: "Backcountry", name: "Horseback riding", blurb: "Steak-dinner rides, pack trips, hay wagons and pony rides.", image: actHorse, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "summer", label: "On the water", name: "Lake cruises", blurb: "Paddle wheel and catamaran cruises, including dinner at sunset.", image: actCruise, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "winter", label: "Heavenly · ski shuttle", name: "Ski & snowboard", blurb: "Ski services are included in your stay. The gondola is three blocks away.", image: actSnowboard, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "winter", label: "Quiet trails", name: "Snowshoe & Nordic", blurb: "Cross-country skiing and snowshoeing through the forest.", image: actSnowshoe, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "winter", label: "Guided", name: "Snowmobile tours", blurb: "Ride high above the lake with a guide who knows the terrain.", image: actSnowmobile, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "winter", label: "For everyone", name: "Tubing & sledding", blurb: "Sledding hills, tubing parks and ice skating in Heavenly Village.", image: actTube, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "winter", label: "Day trip", name: "Sleigh rides", blurb: "Sleigh rides in Incline Village on the north shore make a memorable outing.", image: actSki, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "winter", label: "Year-round", name: "Fishing charters", blurb: "The lake never freezes. Charters run through the winter.", image: actFishing, href: "https://www.thelandingtahoe.com/activities/" },
  { season: "winter", label: "Après", name: "Fire pits & s'mores", blurb: "Back at the resort, the patio fire pits and the rooftop fireplace.", image: lifeSmores, href: "/dine/" },
  { season: "winter", label: "Heated · outdoors", name: "Pool & hot tub", blurb: "Steam rising off the pool with snow on the pines behind it.", image: spaRobes, href: "/spa/" },
];

export interface Venue {
  name: string;
  tag: string;
  blurb: string;
  image: ImageMetadata;
}

export const venues: Venue[] = [
  { name: "Grand Rooftop Terrace", tag: "Open air", blurb: "Sweeping lake views for dining, dancing and ceremonies under the sky.", image: gatherRooftop },
  { name: "Lakeside Ballroom", tag: "Floor-to-ceiling glass", blurb: "Flexible, bright and scenic, with glass doors that open to the lake.", image: gatherBallroom },
  { name: "Bijou Boardroom", tag: "Covered patio", blurb: "An intimate room for meetings and breakouts, with its own patio.", image: gatherBoardroom },
];

export const reviews = [
  { text: "This hotel is amazing. Do not hesitate to book. My husband and I visited for his 40th weekend, and it was a trip we will always remember, partly from the excellent staff and service.", source: "Tripadvisor · 2025" },
  { text: "Everyone at the resort was so genuine, warm and kind. I felt like we were in a Hallmark movie. You can walk to town easily or take the free shuttle. And splurge on a lake-view room.", source: "Tripadvisor · 2025" },
  { text: "Starting from the heated floors and the tub and the fireplace and balcony, everything was top notch. The service was phenomenal. They have a shuttle that does pick-up and drop-off anywhere, free.", source: "Google · 2026" },
];

export const distances = [
  { place: "Lakeside Beach & Marina", d: "steps" },
  { place: "Heavenly Village & gondola", d: "3 blocks" },
  { place: "Stateline casinos", d: "≈ 0.5 mi" },
  { place: "Tahoe Blue Event Center", d: "≈ 0.5 mi" },
  { place: "Emerald Bay", d: "≈ 12 mi" },
  { place: "Reno–Tahoe International Airport", d: "≈ 58 mi" },
  { place: "Sacramento", d: "≈ 100 mi" },
  { place: "San Francisco", d: "≈ 190 mi" },
];

export const stayFaq = [
  { q: "Can I check in early?", a: "Guaranteed check-in is 4 pm, but you are welcome any time. We will try to find a ready room; otherwise we store your luggage, put you on a priority queue and call when it is ready. The resort is yours to enjoy in the meantime." },
  { q: "Which rooms guarantee a lake view?", a: "Lakeview Two Queens, Lakeview King, Premier Lakefront Studio and the One-Bedroom Lakefront Suite all face the water." },
  { q: "If we want a bathtub and a balcony, what should we book?", a: "Every Premier room guarantees both a bathtub and a balcony." },
  { q: "Is there a private beach?", a: "Two passes a day to privately owned Lakeside Beach are included with your stay. It is a semi-private beach just steps from the property." },
  { q: "What does the resort fee include?", a: "High-speed internet, the fitness center, the heated outdoor pool and hot tub, two Lakeside Beach passes a day, welcome beverages, local shuttle service, priority bicycle rentals and ski services." },
  { q: "Do rooms have a fridge and microwave?", a: "Every room has a mini fridge. Microwaves are available on request in limited numbers and cannot be guaranteed." },
  { q: "Is there an airport shuttle?", a: "Not directly. The South Tahoe Airporter is the most economical option and our shuttle can collect you from its casino drop-off. We can also arrange a private driver." },
];

export const gatherFaq = [
  { q: "Is there a place for couples to get ready?", a: "There is no dedicated getting-ready space, so couples typically use their guest room. If you plan to, the room must be booked for the wedding night and the night before." },
  { q: "Can we hold the ceremony outdoors?", a: "Yes. The Grand Rooftop Terrace hosts ceremonies with the lake behind you, and the Lakeside Ballroom opens through floor-to-ceiling glass doors when the weather turns." },
  { q: "How do we start?", a: "Send a request for proposal with your dates, headcount and the kind of event, and the events team will come back with venue options and a quote." },
];
