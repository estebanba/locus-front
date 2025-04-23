export interface ActivityItem {
  title: string;
  subtitle: string;
  company: string | null;
  labels: string[];
  role: string;
  description: string;
  date?: string | number;
  dateFrom: Date;
  dateUntil?: Date;
  url: string;
  images?: string[];
  image?: string[];
  type?: string;
  category?: string;
}

const createDate = (dateString: string): Date => new Date(dateString);

export const activity: ActivityItem[] = [
  {
    title: "Industrial Asset Management System",
    subtitle: "Developed a web-based asset management application for tracking equipment throughout design and construction phases",
    company: "Tesla",
    labels: ["work", "software", "architecture"],
    role: "Software Engineer",
    description: "Developed Engineering Applications",
    date: 2022,
    dateFrom: createDate("2022-11-01"),
    dateUntil: createDate("2024-07-01"),
    url: "https://www.tesla.com/",
    image: [],
  },
  {
    title: "Tesla",
    subtitle: "Web applications for data management and 3D models in Quality Control",
    company: "Tesla",
    labels: ["work", "software"],
    role: "Software Engineer",
    description: "Developed Engineering Applications",
    date: 2023,
    dateFrom: createDate("2023-11-01"),
    dateUntil: createDate("2024-07-01"),
    url: "https://www.tesla.com/",
    image: [],
  },
  {
    title: "Tesla",
    subtitle: "Web applications for data management and 3D models in Manufacturing",
    company: "Tesla",
    labels: ["work", "software"],
    role: "Software Engineer",
    description: "Developed Engineering Applications",
    date: 2024,
    dateFrom: createDate("2024-11-01"),
    dateUntil: createDate("2024-07-01"),
    url: "https://www.tesla.com/",
    image: [],
  },
  {
    title: "Portfolio 2",
    subtitle: "Small makeover",
    company: null,
    category: "Post",
    type: "Application",
    labels: ["project"],
    role: "Creator",
    description: "This is my portfolio",
    date: "2024",
    dateFrom: createDate("2024-10-01"),
    url: "https://www.estebanbasili.com/",
    images: [],
  },
  {
    title: "Boxi in winter",
    subtitle: "Walking in Berlin on a cold afternoon",
    company: null,
    labels: ["photography", "label B", "experiment"],
    role: "Creator",
    description: "A Tool to Blabla",
    date: "29/11/2023",
    dateFrom: createDate("2023-11-29"),
    url: "https://photos.app.goo.gl/sXnVmAhMicrQ1vn19",
    images: [],
  },
  {
    title: "Ironhack",
    subtitle: "Full Stack Web Development Bootcamp",
    company: "Ironhack",
    labels: ["software", "experiment"],
    role: "Bootcamp Participant",
    description: "Completed a full-time Full Stack Web Development Bootcamp focused on front-end and back-end technologies.",
    dateFrom: createDate("2022-05-01"),
    dateUntil: createDate("2022-07-01"),
    url: "https://www.ironhack.com/",
    images: [],
  },
  {
    title: "Travel Sabbatical",
    subtitle: "Exploration of different countries for personal growth",
    company: "Self-employed",
    labels: ["experiment"],
    role: "Traveler",
    description: "Traveled through Mexico, Costa Rica, Argentina, and Brazil for personal exploration and growth.",
    dateFrom: createDate("2021-10-01"),
    dateUntil: createDate("2022-03-01"),
    url: "",
    images: [],
  },
  {
    title: "Amazon",
    subtitle: "BIM data production and coordination for fulfillment centers",
    company: "Hyphen A GmbH",
    labels: ["architecture", "work"],
    role: "Project Architect and BIM Specialist",
    description: "Managed BIM data production for logistics projects, led a BIM coordination team, and developed BIM standards and training for Amazon projects.",
    dateFrom: createDate("2018-10-01"),
    dateUntil: createDate("2021-09-01"),
    url: "https://www.hyphen.com/",
    images: [],
  },
  {
    title: "Tapebicuá",
    subtitle: "Consulting on design and construction of industrialized timber housing",
    company: "Tapebicuá",
    labels: ["architecture", "project"],
    role: "Consulting Architect",
    description: "Provided consulting to management on the design and construction of timber housing, reducing lead times by 20%.",
    dateFrom: createDate("2018-02-01"),
    dateUntil: createDate("2018-09-01"),
    url: "",
    images: [],
  },
  {
    title: "Revit a Medida",
    subtitle: "Customized Revit and BIM Training",
    company: "Revit a Medida",
    labels: ["architecture", "teaching"],
    role: "Revit Instructor",
    description: "Conducted one-on-one and group lessons on Revit and BIM.",
    dateFrom: createDate("2017-02-01"),
    dateUntil: createDate("2019-01-01"),
    url: "",
    images: [],
  }
]; 