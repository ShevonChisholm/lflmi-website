import { createBrowserRouter, Navigate } from "react-router";
import Home from "./pages/Home";
import BibleReader from "./pages/BibleReader";
import PublicLayout from "./layouts/PublicLayout";
import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Visitors from "./pages/admin/Visitors";
import PrayerRequests from "./pages/admin/PrayerRequests";
import Sermons from "./pages/admin/Sermons";
import Events from "./pages/admin/Events";
import PlannedVisits from "./pages/admin/PlannedVisits";
import Attendance from "./pages/admin/Attendance";
import Members from "./pages/admin/Members";
import Give from "./pages/admin/Give";
import Ministries from "./pages/admin/Ministries";
import About from "./pages/admin/About";
import ContactMessages from "./pages/admin/ContactMessages";
import ContentPages from "./pages/admin/ContentPages";
import Admins from "./pages/admin/Admins";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/bible", element: <BibleReader /> },
    ],
  },
  { path: "/admin/login", Component: Login },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", Component: Dashboard },
      { path: "visitors", Component: Visitors },
      { path: "prayer-requests", Component: PrayerRequests },
      { path: "sermons", Component: Sermons },
      { path: "events", Component: Events },
      { path: "planned-visits", Component: PlannedVisits },
      { path: "attendance", Component: Attendance },
      { path: "members", Component: Members },
      { path: "give", Component: Give },
      { path: "ministries", Component: Ministries },
      { path: "about", Component: About },
      { path: "contact-messages", Component: ContactMessages },
      { path: "content-pages", Component: ContentPages },
      { path: "admins", Component: Admins },
    ],
  },
]);
