import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { PublicFooter } from "@/app/components/public/PublicFooter";
import { PublicHeader } from "@/app/components/public/PublicHeader";
import {
  PublicActionDialog,
  type PublicDialogMode,
} from "@/app/components/public/PublicActionDialog";
import { ScrollToTopButton } from "@/app/components/public/ScrollToTopButton";
import { useHomeContent, type HomeContent } from "@/app/hooks/useHomeContent";
import type { Event, Ministry } from "@/types";

export interface PublicLayoutContextValue extends HomeContent {
  openDialog: (mode: PublicDialogMode) => void;
  openEvent: (event: Event) => void;
  openMinistry: (ministry: Ministry) => void;
}

export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const content = useHomeContent();
  const [dialogMode, setDialogMode] = useState<PublicDialogMode | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(
    null,
  );

  const openDialog = (mode: PublicDialogMode) => {
    setSelectedEvent(null);
    setSelectedMinistry(null);
    setDialogMode(mode);
  };

  const openEvent = (event: Event) => {
    setSelectedEvent(event);
    setSelectedMinistry(null);
    setDialogMode("event");
  };

  const openMinistry = (ministry: Ministry) => {
    setSelectedEvent(null);
    setSelectedMinistry(ministry);
    setDialogMode("ministry");
  };

  const outletContext: PublicLayoutContextValue = {
    ...content,
    openDialog,
    openEvent,
    openMinistry,
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <PublicHeader
        transparentAtTop={isHome}
        onPlanVisit={() => openDialog("visit")}
      />

      <main className={isHome ? "" : "pt-20"}>
        <Outlet context={outletContext} />
      </main>

      <PublicFooter
        churchSettings={content.churchSettings}
        onOpenDialog={openDialog}
      />

      <ScrollToTopButton />

      {dialogMode && (
        <PublicActionDialog
          key={`${dialogMode}-${selectedEvent?.id ?? ""}-${selectedMinistry?.id ?? ""}`}
          mode={dialogMode}
          onClose={() => setDialogMode(null)}
          churchSettings={content.churchSettings}
          serviceTimes={content.serviceTimes}
          events={content.events}
          event={selectedEvent}
          ministry={selectedMinistry}
          sermon={content.latestSermon}
          onSelectEvent={openEvent}
        />
      )}
    </div>
  );
}
