import { useEffect, useState } from "react";

import {
  getActiveMinistries,
  getActiveServiceTimes,
  getChurchSettings,
  getPublishedEvents,
  getPublishedSermons,
} from "@/lib/data";
import type {
  ChurchSettings,
  Event,
  Ministry,
  Sermon,
  ServiceTime,
} from "@/types";

const fallbackServiceTimes: ServiceTime[] = [
  {
    id: "fallback-early-service",
    dayOfWeek: "Sunday",
    label: "Early Service",
    time: "08:00:00",
    location: "Main Sanctuary",
    sortOrder: 1,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-main-service",
    dayOfWeek: "Sunday",
    label: "Main Service",
    time: "10:30:00",
    location: "Main Sanctuary",
    sortOrder: 2,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-midweek-prayer",
    dayOfWeek: "Wednesday",
    label: "Midweek Prayer",
    time: "19:00:00",
    location: "Main Sanctuary",
    sortOrder: 3,
    isActive: true,
    createdAt: "",
    updatedAt: "",
  },
];

const fallbackSermon: Sermon = {
  id: "fallback-sermon",
  title: "Unshackled: Living Free from Fear",
  preacherName: "Pastor Emmanuel Adeyemi",
  sermonDate: "2025-06-15T10:30:00Z",
  series: "Walking In Freedom",
  bibleText: "1 John 4:18",
  description:
    "A powerful message about stepping boldly into the liberty Christ has purchased for us.",
  videoUrl: null,
  audioUrl: null,
  notesUrl: null,
  thumbnailUrl:
    "https://images.unsplash.com/photo-1610414961792-b7fffebddd14?w=900&h=600&fit=crop&auto=format",
  durationMinutes: 48,
  viewCount: 0,
  publicationStatus: "PUBLISHED",
  createdAt: "",
  updatedAt: "",
};

const fallbackEvents: Event[] = [
  {
    id: "fallback-family-night",
    title: "Family Faith Night",
    eventType: "Family",
    description:
      "A special evening of worship, games, and fellowship for the entire family.",
    startDate: "2026-06-27T23:00:00Z",
    endDate: "2026-06-28T02:00:00Z",
    location: "Main Sanctuary",
    imageUrl: null,
    organizerName: "Family Ministry Team",
    isRegistrationRequired: true,
    maxAttendees: 300,
    status: "UPCOMING",
    publicationStatus: "PUBLISHED",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-outreach",
    title: "Community Care Outreach",
    eventType: "Outreach",
    description:
      "Serving local families through practical support, encouragement, and prayer.",
    startDate: "2026-07-11T14:00:00Z",
    endDate: "2026-07-11T19:00:00Z",
    location: "Liberty Community Centre",
    imageUrl: null,
    organizerName: "Global Missions Team",
    isRegistrationRequired: true,
    maxAttendees: 120,
    status: "UPCOMING",
    publicationStatus: "PUBLISHED",
    createdAt: "",
    updatedAt: "",
  },
];

const fallbackMinistries: Ministry[] = [
  {
    id: "fallback-children",
    name: "Children's Ministry",
    description:
      "Safe, fun, and faith-filled environments for kids from birth through 5th grade.",
    leaderId: null,
    leaderName: null,
    contactEmail: null,
    contactPhone: null,
    imageUrl: null,
    icon: "children",
    color: "#0E5AA7",
    meetingSchedule: null,
    programs: [],
    memberCount: 0,
    volunteerCount: 0,
    status: "ACTIVE",
    sortOrder: 1,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-youth",
    name: "Youth & Young Adults",
    description:
      "Empowering the next generation to live bold, Spirit-led lives with purpose.",
    leaderId: null,
    leaderName: null,
    contactEmail: null,
    contactPhone: null,
    imageUrl: null,
    icon: "youth",
    color: "#D7261E",
    meetingSchedule: null,
    programs: [],
    memberCount: 0,
    volunteerCount: 0,
    status: "ACTIVE",
    sortOrder: 2,
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "fallback-missions",
    name: "Global Missions",
    description:
      "Carrying the love of Christ to communities near and far around the world.",
    leaderId: null,
    leaderName: null,
    contactEmail: null,
    contactPhone: null,
    imageUrl: null,
    icon: "missions",
    color: "#0E5AA7",
    meetingSchedule: null,
    programs: [],
    memberCount: 0,
    volunteerCount: 0,
    status: "ACTIVE",
    sortOrder: 3,
    createdAt: "",
    updatedAt: "",
  },
];

const fallbackChurchSettings: ChurchSettings = {
  id: "fallback-church-settings",
  churchName: "Liberty For Living Ministries International",
  tagline: "Walking in freedom. Living in purpose. Together in Christ.",
  bio: "Liberty For Living Ministries International was founded on a simple, profound conviction: that Jesus Christ came to set humanity free, and that freedom is meant to be lived out loud, together.",
  vision: null,
  mission: null,
  foundedYear: 2005,
  publicMemberCount: 5000,
  lifeGroupCount: 12,
  nationsReached: 8,
  seniorPastor: "Pastor Emmanuel Adeyemi",
  associatePastor: null,
  logoUrl: null,
  address: "123 Liberty Way, Kingston, Jamaica",
  phone: "+1 876 555 0100",
  email: "hello@lflmi.org",
  website: null,
  socialLinks: {
    facebook: null,
    instagram: null,
    youtube: null,
    twitter: null,
  },
  createdAt: "",
  updatedAt: "",
};

export interface HomeContent {
  serviceTimes: ServiceTime[];
  latestSermon: Sermon;
  events: Event[];
  ministries: Ministry[];
  churchSettings: ChurchSettings;
  isLoading: boolean;
  failedSections: string[];
}

export const useHomeContent = (): HomeContent => {
  const [content, setContent] = useState<HomeContent>({
    serviceTimes: fallbackServiceTimes,
    latestSermon: fallbackSermon,
    events: fallbackEvents,
    ministries: fallbackMinistries,
    churchSettings: fallbackChurchSettings,
    isLoading: true,
    failedSections: [],
  });

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      const results = await Promise.allSettled([
        getActiveServiceTimes(),
        getPublishedSermons({ limit: 1 }),
        getPublishedEvents({ upcomingOnly: true, limit: 3 }),
        getActiveMinistries({ limit: 6 }),
        getChurchSettings(),
      ]);

      if (!isMounted) {
        return;
      }

      const failedSections: string[] = [];
      const [serviceTimes, sermons, events, ministries, churchSettings] = results;

      if (serviceTimes.status === "rejected") failedSections.push("service times");
      if (sermons.status === "rejected") failedSections.push("latest sermon");
      if (events.status === "rejected") failedSections.push("events");
      if (ministries.status === "rejected") failedSections.push("ministries");
      if (churchSettings.status === "rejected") failedSections.push("church information");

      setContent((current) => ({
        serviceTimes:
          serviceTimes.status === "fulfilled" && serviceTimes.value.length > 0
            ? serviceTimes.value
            : current.serviceTimes,
        latestSermon:
          sermons.status === "fulfilled" && sermons.value[0]
            ? sermons.value[0]
            : current.latestSermon,
        events:
          events.status === "fulfilled" && events.value.length > 0
            ? events.value
            : current.events,
        ministries:
          ministries.status === "fulfilled" && ministries.value.length > 0
            ? ministries.value
            : current.ministries,
        churchSettings:
          churchSettings.status === "fulfilled" && churchSettings.value
            ? churchSettings.value
            : current.churchSettings,
        isLoading: false,
        failedSections,
      }));
    };

    void loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  return content;
};
