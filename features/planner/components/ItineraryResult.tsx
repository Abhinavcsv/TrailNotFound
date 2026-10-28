"use client";
import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
  CalendarDays,
  Clock,
  Lightbulb,
  MapPin,
  Wallet,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Route,
  Pencil,
  Copy,
  Trash2,
  Check,
  X,
  GripVertical,
  Plus,
  Search,
  Clock3,
  AlertTriangle,
} from "lucide-react";

import type { ItineraryResponse } from "../types/itinerary";

async function downloadItineraryPDF(itinerary: ItineraryResponse) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = 20;

  const addPageIfNeeded = (requiredHeight = 20) => {
    if (y + requiredHeight > pageHeight - margin) {
      doc.addPage();
      y = 20;
    }
  };

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("TrailNotFound", margin, y);
  y += 10;

  doc.setFontSize(16);
  doc.text("Your Travel Itinerary", margin, y);
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Destination: ${itinerary.destination}`, margin, y);
  y += 7;

  const summaryLines = doc.splitTextToSize(
    itinerary.summary || "",
    pageWidth - margin * 2
  );
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 5 + 5;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Estimated total: INR ${itinerary.totalEstimatedCost}`, margin, y);
  y += 10;

  for (const day of itinerary.days) {
    addPageIfNeeded(25);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Day ${day.day}: ${day.title}`, margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["Time", "Activity", "Duration", "Cost (INR)", "Description"]],
      body: day.activities.map((activity) => [
        activity.time,
        activity.title,
        `${activity.durationMinutes ?? 60} min`,
        String(activity.estimatedCost ?? 0),
        activity.description,
      ]),
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak" },
      headStyles: { fillColor: [35, 75, 65] },
    });

    y = (doc as any).lastAutoTable.finalY + 8;
  }

  addPageIfNeeded(35);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Budget Breakdown", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Category", "Estimated cost (INR)"]],
    body: Object.entries(itinerary.budgetBreakdown).map(([category, amount]) => [
      category.charAt(0).toUpperCase() + category.slice(1),
      String(amount),
    ]),
    margin: { left: margin, right: margin },
    styles: { fontSize: 9 },
  });

  y = (doc as any).lastAutoTable.finalY + 10;
  addPageIfNeeded(35);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Hidden Gems", margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  for (const gem of itinerary.hiddenGems ?? []) {
    const lines = doc.splitTextToSize(
      `${gem.name} (${gem.location})\n${gem.description}\nWhy visit: ${gem.whyVisit}`,
      pageWidth - margin * 2
    );
    addPageIfNeeded(lines.length * 5 + 5);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 5;
  }

  addPageIfNeeded(25);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Travel Tips", margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  for (const tip of itinerary.travelTips ?? []) {
    const lines = doc.splitTextToSize(
      `• ${tip}`,
      pageWidth - margin * 2
    );
    addPageIfNeeded(lines.length * 5 + 3);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3;
  }

  const filename = `${itinerary.destination || "trip"}-itinerary`
    .replace(/[^a-z0-9-_]/gi, "-")
    .toLowerCase();

  doc.save(`${filename}.pdf`);
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
function parseTimeToMinutes(value: string): number | null {
  const input = value.trim();
  const match = input.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (minutes > 59 || hours > 24 || hours < 0) return null;
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    hours = hours % 12 + (meridiem === "PM" ? 12 : 0);
  }
  if (hours === 24) hours = 0;
  return hours * 60 + minutes;
}

function formatTime(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${suffix}`;
}

function toTimeInput(value: string): string {
  const minutes = parseTimeToMinutes(value);
  if (minutes === null) return "09:00";
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function activityDuration(activity: ItineraryResponse["days"][number]["activities"][number]) {
  return Math.max(15, activity.durationMinutes ?? 60);
}

function rescheduleActivities(
  activities: ItineraryResponse["days"][number]["activities"],
  startIndex = 0,
) {
  const result = activities.map((activity) => ({ ...activity }));
  if (!result.length || startIndex >= result.length) return result;
  let cursor = parseTimeToMinutes(result[startIndex].time) ?? 9 * 60;
  for (let i = startIndex; i < result.length; i++) {
    if (i > startIndex) {
      cursor += activityDuration(result[i - 1]) + 15;
    }
    result[i].time = formatTime(cursor);
  }
  return result;
}

const ACTIVITY_LIBRARY = [
  { title: "Explore a local landmark", category: "sightseeing", description: "Visit a well-known local attraction and leave time to explore the surrounding area.", durationMinutes: 90, estimatedCost: 200 },
  { title: "Try local food", category: "food", description: "Sample a regional dish at a locally recommended eatery.", durationMinutes: 60, estimatedCost: 350 },
  { title: "Nature walk", category: "nature", description: "Take an easy walk in a nearby park, garden or nature area.", durationMinutes: 75, estimatedCost: 100 },
  { title: "Sunset viewpoint", category: "nature", description: "Visit a suitable viewpoint before sunset; check local access and weather first.", durationMinutes: 60, estimatedCost: 100 },
  { title: "Museum or heritage visit", category: "culture", description: "Explore local history, art or cultural heritage at a nearby museum or site.", durationMinutes: 90, estimatedCost: 250 },
  { title: "Local market stroll", category: "shopping", description: "Browse a local market for crafts, snacks and regional products.", durationMinutes: 60, estimatedCost: 500 },
  { title: "Cafe break", category: "food", description: "Take a relaxed break at a cafe in the area.", durationMinutes: 45, estimatedCost: 250 },
  { title: "Adventure activity", category: "adventure", description: "Choose a locally available guided activity appropriate for the season and your ability.", durationMinutes: 120, estimatedCost: 800 },
  { title: "Relax and explore nearby streets", category: "relaxation", description: "Keep some unhurried time to explore nearby streets and take a break between major stops.", durationMinutes: 60, estimatedCost: 0 },
];

function SortableActivity({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        position: "relative",
      }}
      className="group"
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag activity to reorder or move to another day"
        className="absolute right-0 top-0 z-20 cursor-grab rounded-lg border border-border bg-white/90 p-1.5 text-muted-foreground shadow-sm hover:text-primary active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {children}
    </div>
  );
}

function DroppableDay({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl transition-colors ${
        isOver ? "bg-primary/5 ring-2 ring-primary/20" : ""
      }`}
    >
      {children}
    </div>
  );
}
export function ItineraryResult({
  itinerary,
  onUpdate,
}: {
  itinerary: ItineraryResponse;
  onUpdate: (updated: ItineraryResponse) => void;
}) {
  const totalDays = itinerary.days.length;
  const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: { distance: 6 },
  }),
);

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const activeId = String(active.id);
  const overId = String(over.id);

  const sourceDayIndex = itinerary.days.findIndex((day) =>
    day.activities.some((activity) => activity.id === activeId),
  );

  if (sourceDayIndex === -1) return;

  const sourceDay = itinerary.days[sourceDayIndex];
  const sourceActivityIndex = sourceDay.activities.findIndex(
    (activity) => activity.id === activeId,
  );

  if (sourceActivityIndex === -1) return;

  const targetDayIndex = itinerary.days.findIndex(
    (day) =>
      day.activities.some((activity) => activity.id === overId) ||
      `day-${day.day}` === overId,
  );

  if (targetDayIndex === -1) return;

  const targetDay = itinerary.days[targetDayIndex];
  const targetActivityIndex = targetDay.activities.findIndex(
    (activity) => activity.id === overId,
  );

  const updatedDays = itinerary.days.map((day) => ({
    ...day,
    activities: [...day.activities],
  }));

  if (sourceDayIndex === targetDayIndex) {
    if (targetActivityIndex === -1) return;

    updatedDays[sourceDayIndex].activities = arrayMove(
      updatedDays[sourceDayIndex].activities,
      sourceActivityIndex,
      targetActivityIndex,
    );
  } else {
    const [movedActivity] = updatedDays[sourceDayIndex].activities.splice(
      sourceActivityIndex,
      1,
    );

    const insertAt =
      targetActivityIndex === -1
        ? updatedDays[targetDayIndex].activities.length
        : targetActivityIndex;

    updatedDays[targetDayIndex].activities.splice(
      insertAt,
      0,
      movedActivity,
    );
  }

  updatedDays[sourceDayIndex].activities = rescheduleActivities(updatedDays[sourceDayIndex].activities);
  if (targetDayIndex !== sourceDayIndex) {
    updatedDays[targetDayIndex].activities = rescheduleActivities(updatedDays[targetDayIndex].activities);
  }

  onUpdate({
    ...itinerary,
    days: updatedDays,
  });
}
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDuration, setEditDuration] = useState("60");
  const [editCost, setEditCost] = useState("0");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryCategory, setLibraryCategory] = useState("all");
  const [selectedDay, setSelectedDay] = useState("1");
  function updateActivity(
    dayIndex: number,
    activityId: string,
    changes: Partial<ItineraryResponse["days"][number]["activities"][number]>,
  ) {
    const oldActivity = itinerary.days[dayIndex]?.activities.find((activity) => activity.id === activityId);
    const oldCost = oldActivity?.estimatedCost ?? 0;
    const newCost = changes.estimatedCost ?? oldCost;
    const updatedDays = itinerary.days.map((day, index) => {
      if (index !== dayIndex) return day;
      const activities = day.activities.map((activity) =>
        activity.id === activityId ? { ...activity, ...changes } : activity,
      );
      const changedIndex = activities.findIndex((activity) => activity.id === activityId);
      return {
        ...day,
        estimatedCost: Math.max(0, day.estimatedCost + newCost - oldCost),
        activities: rescheduleActivities(activities, Math.max(0, changedIndex)),
      };
    });
    const costDelta = newCost - oldCost;
    onUpdate({
      ...itinerary,
      days: updatedDays,
      totalEstimatedCost: Math.max(0, itinerary.totalEstimatedCost + costDelta),
      budgetBreakdown: { ...itinerary.budgetBreakdown, activities: Math.max(0, itinerary.budgetBreakdown.activities + costDelta) },
    });
  }

  function addLibraryActivity(dayIndex: number, template: (typeof ACTIVITY_LIBRARY)[number]) {
    const targetDay = itinerary.days[dayIndex];
    if (!targetDay) return;
    const lastActivity = targetDay.activities[targetDay.activities.length - 1];
    const startAt = lastActivity
      ? (parseTimeToMinutes(lastActivity.time) ?? 9 * 60) + activityDuration(lastActivity) + 15
      : 9 * 60;
    const newActivity = {
      id: crypto.randomUUID(),
      title: template.title,
      description: template.description,
      time: formatTime(startAt),
      durationMinutes: template.durationMinutes,
      estimatedCost: template.estimatedCost,
      category: template.category,
      location: itinerary.destination,
    };
    const updatedDays = itinerary.days.map((day, index) => index === dayIndex
      ? { ...day, activities: [...day.activities, newActivity], estimatedCost: day.estimatedCost + template.estimatedCost }
      : day);
    const breakdown = itinerary.budgetBreakdown;
    onUpdate({
      ...itinerary,
      days: updatedDays,
      totalEstimatedCost: itinerary.totalEstimatedCost + template.estimatedCost,
      budgetBreakdown: { ...breakdown, activities: breakdown.activities + template.estimatedCost },
    });
  }


function deleteActivity(dayIndex: number, activityId: string) {
  const removed = itinerary.days[dayIndex]?.activities.find((activity) => activity.id === activityId);
  const removedCost = removed?.estimatedCost ?? 0;
  const updatedDays = itinerary.days.map((day, index) => {
    if (index !== dayIndex) return day;
    const activities = day.activities.filter((activity) => activity.id !== activityId);
    return { ...day, activities: rescheduleActivities(activities), estimatedCost: Math.max(0, day.estimatedCost - removedCost) };
  });
  onUpdate({
    ...itinerary,
    days: updatedDays,
    totalEstimatedCost: Math.max(0, itinerary.totalEstimatedCost - removedCost),
    budgetBreakdown: { ...itinerary.budgetBreakdown, activities: Math.max(0, itinerary.budgetBreakdown.activities - removedCost) },
  });
}

function duplicateActivity(dayIndex: number, activityId: string) {
  const day = itinerary.days[dayIndex];
  const activity = day?.activities.find((item) => item.id === activityId);

  if (!day || !activity) return;

  const duplicate = {
    ...activity,
    id: crypto.randomUUID(),
    title: `${activity.title} (Copy)`,
  };

  const updated = {
    ...itinerary,
    days: itinerary.days.map((item, index) =>
      index === dayIndex
        ? {
            ...item,
            estimatedCost: item.estimatedCost + (duplicate.estimatedCost ?? 0),
            activities: rescheduleActivities([
              ...item.activities.slice(
                0,
                item.activities.findIndex((a) => a.id === activityId) + 1,
              ),
              duplicate,
              ...item.activities.slice(
                item.activities.findIndex((a) => a.id === activityId) + 1,
              ),
            ]),
          }
        : item,
    ),
  };

  onUpdate({
    ...updated,
    totalEstimatedCost: itinerary.totalEstimatedCost + (duplicate.estimatedCost ?? 0),
    budgetBreakdown: { ...itinerary.budgetBreakdown, activities: itinerary.budgetBreakdown.activities + (duplicate.estimatedCost ?? 0) },
  });
}

  const visibleLibraryActivities = ACTIVITY_LIBRARY.filter((activity) => {
    const matchesSearch = `${activity.title} ${activity.description} ${activity.category}`.toLowerCase().includes(librarySearch.toLowerCase());
    const matchesCategory = libraryCategory === "all" || activity.category === libraryCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="space-y-6">
      {/* =========================
          TRIP HERO
      ========================== */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-2xl shadow-primary/10 backdrop-blur-2xl sm:p-8">
        {/* Decorative background */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        />

        <div className="relative">
          {/* Label */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Your trip is ready
          </div>

          {/* Destination */}
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Your next adventure
              </div>

              <h2 className="max-w-3xl font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {itinerary.destination}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {itinerary.summary}
              </p>
            </div>

            {/* Cost */}
            <div className="shrink-0 rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4 md:min-w-[190px]">
              <p className="text-xs font-medium text-muted-foreground">
                Estimated trip cost
              </p>

              <p className="mt-1 text-2xl font-extrabold text-primary">
                {formatINR(itinerary.totalEstimatedCost)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-white/70 p-4">
              <CalendarDays className="mb-2 h-4 w-4 text-primary" />
              <p className="text-lg font-bold text-foreground">
                {totalDays}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalDays === 1 ? "Day" : "Days"}
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-white/70 p-4">
              <Wallet className="mb-2 h-4 w-4 text-primary" />
              <p className="text-lg font-bold text-foreground">
                {formatINR(itinerary.totalEstimatedCost)}
              </p>
              <p className="text-xs text-muted-foreground">
                Estimated total
              </p>
            </div>

            <div className="col-span-2 rounded-2xl border border-border/60 bg-white/70 p-4 sm:col-span-1">
              <Route className="mb-2 h-4 w-4 text-primary" />
              <p className="text-lg font-bold text-foreground">
                Day by day
              </p>
              <p className="text-xs text-muted-foreground">
                Personalized itinerary
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          ITINERARY HEADER
      ========================== */}
      
<div className="flex flex-col gap-4 px-1 pt-3 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
      Your itinerary
    </p>

    <h3 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-foreground">
      Make the most of every day.
    </h3>
  </div>

  <button
    type="button"
    onClick={async () => {
      try {
        await downloadItineraryPDF(itinerary);
      } catch (error) {
        console.error("PDF download failed:", error);
        window.alert("Unable to download PDF. Please try again.");
      }
    }}
    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90"
  >
    <ArrowRight className="h-4 w-4" />
    Download PDF
  </button>
</div>

      {/* =========================
          ACTIVITY LIBRARY
      ========================== */}
      <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-white/80 shadow-lg shadow-primary/5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4" /><p className="text-xs font-bold uppercase tracking-[0.18em]">Customize your plan</p></div>
            <h3 className="mt-1 text-xl font-extrabold text-foreground">Activity Library</h3>
            <p className="mt-1 text-sm text-muted-foreground">Add ideas to any day. These are editable starting points, not verified live listings.</p>
          </div>
          <button type="button" onClick={() => setLibraryOpen((open) => !open)} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90">
            <Plus className="h-4 w-4" /> {libraryOpen ? "Close library" : "Add activities"}
          </button>
        </div>
        {libraryOpen && <div className="space-y-4 p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-[1fr_190px_190px]">
            <label className="relative block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={librarySearch} onChange={(event) => setLibrarySearch(event.target.value)} placeholder="Search activity ideas..." className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary" /></label>
            <select value={libraryCategory} onChange={(event) => setLibraryCategory(event.target.value)} className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm"><option value="all">All categories</option><option value="sightseeing">Sightseeing</option><option value="food">Food & cafes</option><option value="nature">Nature</option><option value="culture">Culture</option><option value="shopping">Shopping</option><option value="adventure">Adventure</option><option value="relaxation">Relaxation</option></select>
            <select value={selectedDay} onChange={(event) => setSelectedDay(event.target.value)} className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm">{itinerary.days.map((day, index) => <option key={day.day} value={String(index + 1)}>Add to Day {day.day}</option>)}</select>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {visibleLibraryActivities.map((activity) => <div key={activity.title} className="flex flex-col justify-between gap-3 rounded-2xl border border-border/70 bg-white/80 p-4 sm:flex-row sm:items-center">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h4 className="text-sm font-bold text-foreground">{activity.title}</h4><span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold capitalize text-primary">{activity.category}</span></div><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{activity.description}</p><div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{activity.durationMinutes} min</span><span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5" />~{formatINR(activity.estimatedCost)}</span></div></div>
              <button type="button" onClick={() => addLibraryActivity(Number(selectedDay) - 1, activity)} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-primary/25 px-3 py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"><Plus className="h-3.5 w-3.5" /> Add</button>
            </div>)}
            {visibleLibraryActivities.length === 0 && <p className="rounded-xl bg-secondary/50 p-4 text-sm text-muted-foreground">No matching activities. Try another search or category.</p>}
          </div>
        </div>}
      </div>

      {/* =========================
          DAY TIMELINE
      ========================== */}
      <DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={handleDragEnd}
>
        {itinerary.days.map((day) => (
          <article
            key={day.day}
            className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-xl shadow-primary/5 backdrop-blur-xl"
          >
            {/* Day header */}
            <div className="border-b border-border/50 bg-white/50 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-lg font-extrabold text-primary-foreground shadow-lg shadow-primary/20">
                    {day.day}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      Day {day.day}
                    </p>

                    <h4 className="mt-0.5 font-display text-lg font-bold text-foreground">
                      {day.title}
                    </h4>
                  </div>
                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                  <Wallet className="h-3.5 w-3.5" />
                  {formatINR(day.estimatedCost)}
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="p-5 sm:p-6">
              <div className="relative">
                {/* Timeline line */}
                <div
                  aria-hidden
                  className="absolute bottom-4 left-[7px] top-4 w-px bg-border"
                />

                <DroppableDay id={`day-${day.day}`}>
                  <SortableContext
                    items={day.activities.map(
                      (activity, index) => activity.id ?? `${day.day}-${index}`,
                    )}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-6">
                      {day.activities.map((activity, index) => {
                        const activityId =
                          activity.id ?? `${day.day}-${index}`;

                        return (
                          <SortableActivity key={activityId} id={activityId}>
                            <div className="relative flex gap-4">
                              <div className="relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-4 border-white bg-primary shadow-sm" />

                              <div className="min-w-0 flex-1 pr-8">
                                {editingActivityId === activity.id ? (
                                  <div className="space-y-3 rounded-2xl border border-primary/20 bg-white/80 p-4">
                                    <label className="block space-y-1 text-xs font-semibold text-muted-foreground">Start time
                                      <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground" />
                                    </label>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                      <label className="block space-y-1 text-xs font-semibold text-muted-foreground">Duration (minutes)
                                        <input type="number" min="15" step="15" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground" />
                                      </label>
                                      <label className="block space-y-1 text-xs font-semibold text-muted-foreground">Estimated cost (INR)
                                        <input type="number" min="0" step="50" value={editCost} onChange={(e) => setEditCost(e.target.value)} className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground" />
                                      </label>
                                    </div>

                                    <input
                                      value={editTitle}
                                      onChange={(e) => setEditTitle(e.target.value)}
                                      placeholder="Activity title"
                                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
                                    />

                                    <textarea
                                      value={editDescription}
                                      onChange={(e) => setEditDescription(e.target.value)}
                                      placeholder="Activity description"
                                      rows={3}
                                      className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm"
                                    />

                                    <div className="flex flex-wrap gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateActivity(day.day - 1, activity.id!, {
                                            time: formatTime(parseTimeToMinutes(editTime) ?? 9 * 60),
                                            title: editTitle.trim() || activity.title,
                                            description: editDescription.trim() || activity.description,
                                            durationMinutes: Math.max(15, Number(editDuration) || 60),
                                            estimatedCost: Math.max(0, Number(editCost) || 0),
                                          });
                                          setEditingActivityId(null);
                                        }}
                                        className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
                                      >
                                        Save
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => setEditingActivityId(null)}
                                        className="rounded-full border border-border px-4 py-2 text-xs font-semibold"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {index > 0 && (() => {
                                      const previous = day.activities[index - 1];
                                      const previousStart = parseTimeToMinutes(previous.time);
                                      const currentStart = parseTimeToMinutes(activity.time);
                                      const overlaps = previousStart !== null && currentStart !== null && currentStart < previousStart + activityDuration(previous);
                                      return overlaps ? <div className="mb-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800"><AlertTriangle className="h-3.5 w-3.5" /> Time conflict: overlaps the previous activity</div> : null;
                                    })()}
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                      <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                                        <Clock className="h-3 w-3" />
                                        {activity.time}
                                      </span>

                                      {index === 0 && (
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                          Start
                                        </span>
                                      )}
                                    </div>

                                    <h5 className="mt-1 text-sm font-bold text-foreground">
                                      {activity.title}
                                    </h5>

                                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                      {activity.description}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                                      <span className="rounded-full bg-secondary px-2.5 py-1">{activity.durationMinutes ?? 60} min</span>
                                      <span className="rounded-full bg-secondary px-2.5 py-1">~{formatINR(activity.estimatedCost ?? 0)}</span>
                                      {activity.category && <span className="rounded-full bg-primary/10 px-2.5 py-1 capitalize text-primary">{activity.category}</span>}
                                    </div>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingActivityId(activity.id ?? null);
                                          setEditTitle(activity.title);
                                          setEditDescription(activity.description);
                                          setEditTime(toTimeInput(activity.time));
                                          setEditDuration(String(activity.durationMinutes ?? 60));
                                          setEditCost(String(activity.estimatedCost ?? 0));
                                        }}
                                        disabled={!activity.id}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary/30 hover:text-primary disabled:opacity-40"
                                      >
                                        <Pencil className="h-3.5 w-3.5" />
                                        Edit
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => duplicateActivity(day.day - 1, activity.id!)}
                                        disabled={!activity.id}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:border-primary/30 hover:text-primary disabled:opacity-40"
                                      >
                                        <Copy className="h-3.5 w-3.5" />
                                        Duplicate
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (window.confirm("Delete this activity?")) {
                                            deleteActivity(day.day - 1, activity.id!);
                                          }
                                        }}
                                        disabled={!activity.id}
                                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Delete
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </SortableActivity>
                        );
                      })}
                    </div>
                  </SortableContext>
                </DroppableDay>
              </div>
            </div>
          </article>
        ))}
      </DndContext>

      {/* =========================
          TRIP SUMMARY
      ========================== */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Budget */}
        <div className="rounded-[2rem] border border-primary/15 bg-primary/5 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Wallet className="h-4 w-4" />
            </div>

            <div>
              <h3 className="font-display font-bold text-foreground">
                Trip budget
              </h3>

              <p className="text-xs text-muted-foreground">
                Estimated overall cost
              </p>
            </div>
          </div>

          <p className="text-3xl font-extrabold text-primary">
            {formatINR(itinerary.totalEstimatedCost)}
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-primary/10">
            <div className="h-full w-3/4 rounded-full bg-primary" />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Estimated spend</span>
            <span>Plan accordingly</span>
          </div>
        </div>

        {/* Quick overview */}
        <div className="rounded-[2rem] border border-border/60 bg-white/70 p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>

            <div>
              <h3 className="font-display font-bold text-foreground">
                Trip overview
              </h3>

              <p className="text-xs text-muted-foreground">
                Everything planned for you
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Days planned</span>
              <span className="font-semibold text-foreground">
                {totalDays}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Activities</span>
              <span className="font-semibold text-foreground">
                {itinerary.days.reduce(
                  (total, day) => total + day.activities.length,
                  0,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated spend</span>
              <span className="font-semibold text-foreground">
                {formatINR(itinerary.totalEstimatedCost)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          TRAVEL TIPS
      ========================== */}
      {itinerary.travelTips.length > 0 && (
        <div className="rounded-[2rem] border border-accent/20 bg-accent/5 p-6 shadow-lg shadow-accent/5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-white shadow-md">
              <Lightbulb className="h-4 w-4" />
            </div>

            <div>
              <h3 className="font-display text-lg font-bold text-foreground">
                Travel tips
              </h3>

              <p className="text-xs text-muted-foreground">
                A few things worth knowing before you go.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {itinerary.travelTips.map((tip, index) => (
              <div
                key={index}
                className="flex gap-3 rounded-2xl border border-white/70 bg-white/70 p-4"
              >
                <div className="mt-0.5 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================
          BOTTOM CTA
      ========================== */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-lg backdrop-blur-xl sm:flex-row sm:p-6">
        <div>
          <p className="font-display font-bold text-foreground">
            Ready for your adventure?
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Your itinerary is just the beginning.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
        >
          Refine this trip
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}