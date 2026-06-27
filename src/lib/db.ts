// ── Supabase-backed database layer ──
// All CRUD operations backed by Supabase PostgreSQL.

import { supabase } from "./supabase";

// ── Types ──
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: "ADMIN" | "DOCTOR" | "PARENT";
  phone?: string;
  photo?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  uniqueId: string;
  name: string;
  dob: string;
  gender: "M" | "F" | "Other";
  photo?: string;
  diagnoses: string[];
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  guardianPin: string;
  assignedDoctorId?: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  notes?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  durationMins: number;
  type: "CLINIC" | "ONLINE";
  notes: string;
  goalsAddressed: string[];
  createdAt: string;
}

export interface Goal {
  id: string;
  patientId: string;
  title: string;
  description?: string;
  targetDate?: string;
  achievedAt?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  patientId: string;
  doctorId: string;
  datetime: string;
  type: "CLINIC" | "ONLINE";
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "FAILED";
  amount: number;
  transactionId?: string;
  zoomLink?: string;
  notes?: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  coverImage?: string;
  category: string;
  excerpt: string;
  published: boolean;
  publishedAt?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteContent {
  [key: string]: string | number | boolean | object;
}

// ── NEW: Lead ──
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: "website" | "google" | "whatsapp" | "referral" | "direct" | "other";
  serviceInterest?: string;
  message?: string;
  status: "new" | "contacted" | "booked" | "lost";
  notes?: string;
  doctorId?: string; // Assigned doctor
  createdAt: string;
}

// ── NEW: Doctor Availability ──
export interface DoctorAvailability {
  id: string;
  workingDays: number[];          // 0=Sun,1=Mon,...6=Sat
  startTime: string;              // "10:00"
  endTime: string;                // "19:00"
  breakStart?: string;            // "13:00"
  breakEnd?: string;              // "14:00"
  sessionDurationMins: number;    // 45
  bufferMins: number;             // 10
  updatedAt: string;
}

// ── NEW: Blocked Date ──
export interface BlockedDate {
  id: string;
  date: string;                   // "2025-12-25"
  reason?: string;
  createdAt: string;
}

// ── NEW: Branch (franchise-ready) ────────────────────────────────────────────
export interface Branch {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  managerId?: string;
  isActive: boolean;
  createdAt: string;
}

// ── NEW: Video Testimonial ────────────────────────────────────────────────────
export interface VideoTestimonial {
  id: string;
  parentName: string;          // "Priya Sharma"
  childAge?: string;           // "5 years"
  location?: string;           // "Jabalpur, MP"
  caption?: string;            // "Aryan improved in 3 months!"
  videoUrl: string;            // YouTube URL, Google Drive, or direct mp4
  thumbnailUrl?: string;       // optional custom thumbnail
  isActive: boolean;
  sortOrder: number;           // for ordering on public page
  createdAt: string;
}

// ── NEW: Staff Attendance ─────────────────────────────────────────────────────
export interface StaffAttendance {
  id: string;
  userId: string;
  branchId?: string;
  date: string;                            // "2025-06-24"
  clockIn?: string;                        // ISO timestamp
  clockOut?: string;                       // ISO timestamp
  status: "present" | "absent" | "half_day" | "leave" | "holiday";
  leaveType?: "CL" | "SL" | "PL" | "WO";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── NEW: Staff Activity ───────────────────────────────────────────────────────
export type ActivityType =
  | "patient_session" | "parent_counselling" | "documentation"
  | "meeting" | "break" | "admin_work" | "home_visit"
  | "training" | "lead_followup" | "report" | "other";

export interface StaffActivity {
  id: string;
  userId: string;
  branchId?: string;
  date: string;
  activityType: ActivityType;
  patientId?: string;
  title: string;
  durationMins: number;
  notes?: string;
  startTime?: string;
  createdAt: string;
}

// ── NEW: Leave Request ────────────────────────────────────────────────────────
export interface LeaveRequest {
  id: string;
  userId: string;
  fromDate: string;
  toDate: string;
  leaveType: "CL" | "SL" | "PL" | "WO";
  reason?: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

// ── Helper: map snake_case Supabase rows → camelCase ──
function mapUser(r: Record<string, unknown>): User {
  return { id: r.id as string, email: r.email as string, passwordHash: r.password_hash as string, name: r.name as string, role: r.role as User["role"], phone: r.phone as string | undefined, photo: r.photo as string | undefined, createdAt: r.created_at as string };
}
function mapPatient(r: Record<string, unknown>): Patient {
  return { id: r.id as string, uniqueId: r.unique_id as string, name: r.name as string, dob: r.dob as string, gender: r.gender as Patient["gender"], photo: r.photo as string | undefined, diagnoses: (r.diagnoses as string[]) ?? [], guardianName: r.guardian_name as string, guardianPhone: r.guardian_phone as string, guardianEmail: r.guardian_email as string | undefined, guardianPin: r.guardian_pin as string, assignedDoctorId: r.assigned_doctor_id as string | undefined, status: r.status as Patient["status"], notes: r.notes as string | undefined, createdAt: r.created_at as string };
}
function mapSession(r: Record<string, unknown>): Session {
  return { id: r.id as string, patientId: r.patient_id as string, doctorId: r.doctor_id as string, date: r.date as string, durationMins: r.duration_mins as number, type: r.type as Session["type"], notes: r.notes as string, goalsAddressed: (r.goals_addressed as string[]) ?? [], createdAt: r.created_at as string };
}
function mapGoal(r: Record<string, unknown>): Goal {
  return { id: r.id as string, patientId: r.patient_id as string, title: r.title as string, description: r.description as string | undefined, targetDate: r.target_date as string | undefined, achievedAt: r.achieved_at as string | undefined, createdAt: r.created_at as string };
}
function mapBooking(r: Record<string, unknown>): Booking {
  return { id: r.id as string, patientId: r.patient_id as string, doctorId: r.doctor_id as string, datetime: r.datetime as string, type: r.type as Booking["type"], status: r.status as Booking["status"], paymentStatus: r.payment_status as Booking["paymentStatus"], amount: r.amount as number, zoomLink: r.zoom_link as string | undefined, notes: r.notes as string | undefined, createdAt: r.created_at as string };
}
function mapBlog(r: Record<string, unknown>): BlogPost {
  return { id: r.id as string, slug: r.slug as string, title: r.title as string, content: r.content as string, coverImage: r.cover_image as string | undefined, category: r.category as string, excerpt: r.excerpt as string, published: r.published as boolean, publishedAt: r.published_at as string | undefined, authorId: r.author_id as string, createdAt: r.created_at as string, updatedAt: r.updated_at as string };
}

// ── USERS ──
export const UserDB = {
  getAll: async (): Promise<User[]> => {
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    return (data ?? []).map(mapUser);
  },
  getById: async (id: string): Promise<User | undefined> => {
    const { data } = await supabase.from("users").select("*").eq("id", id).single();
    return data ? mapUser(data) : undefined;
  },
  getByEmail: async (email: string): Promise<User | undefined> => {
    const { data } = await supabase.from("users").select("*").eq("email", email).single();
    return data ? mapUser(data) : undefined;
  },
  create: async (input: Omit<User, "id" | "createdAt">): Promise<User> => {
    const { data, error } = await supabase.from("users").insert({
      email: input.email, password_hash: input.passwordHash, name: input.name,
      role: input.role, phone: input.phone, photo: input.photo,
    }).select().single();
    if (error) throw error;
    return mapUser(data);
  },
  update: async (id: string, input: Partial<User>): Promise<void> => {
    const patch: Record<string, unknown> = {};
    if (input.email !== undefined) patch.email = input.email;
    if (input.name !== undefined) patch.name = input.name;
    if (input.passwordHash !== undefined) patch.password_hash = input.passwordHash;
    if (input.role !== undefined) patch.role = input.role;
    if (input.phone !== undefined) patch.phone = input.phone;
    if (input.photo !== undefined) patch.photo = input.photo;
    await supabase.from("users").update(patch).eq("id", id);
  },
  delete: async (id: string): Promise<void> => { await supabase.from("users").delete().eq("id", id); },
  // Sync versions for NextAuth (called during auth, must be sync-compatible)
  getAllSync: (): User[] => [],
};

// ── PATIENTS ──
export const PatientDB = {
  getAll: async (doctorId?: string): Promise<Patient[]> => {
    let q = supabase.from("patients").select("*").order("created_at", { ascending: false });
    if (doctorId) q = q.eq("assigned_doctor_id", doctorId);
    const { data } = await q;
    return (data ?? []).map(mapPatient);
  },
  getById: async (id: string): Promise<Patient | undefined> => {
    const { data } = await supabase.from("patients").select("*").eq("id", id).single();
    return data ? mapPatient(data) : undefined;
  },
  getByUniqueId: async (uid: string): Promise<Patient | undefined> => {
    const { data } = await supabase.from("patients").select("*").eq("unique_id", uid).single();
    return data ? mapPatient(data) : undefined;
  },
  create: async (input: Omit<Patient, "id" | "uniqueId" | "createdAt">): Promise<Patient> => {
    // Generate unique ID
    const year = new Date().getFullYear();
    const { count } = await supabase.from("patients").select("*", { count: "exact", head: true }).like("unique_id", `UC-${year}-%`);
    const uniqueId = `UC-${year}-${String((count ?? 0) + 1).padStart(4, "0")}`;
    const { data, error } = await supabase.from("patients").insert({
      unique_id: uniqueId, name: input.name, dob: input.dob, gender: input.gender,
      photo: input.photo, diagnoses: input.diagnoses,
      guardian_name: input.guardianName, guardian_phone: input.guardianPhone,
      guardian_email: input.guardianEmail, guardian_pin: input.guardianPin,
      assigned_doctor_id: input.assignedDoctorId, status: input.status, notes: input.notes,
    }).select().single();
    if (error) throw error;
    return mapPatient(data);
  },
  update: async (id: string, input: Partial<Patient>): Promise<void> => {
    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.dob !== undefined) patch.dob = input.dob;
    if (input.gender !== undefined) patch.gender = input.gender;
    if (input.photo !== undefined) patch.photo = input.photo;
    if (input.diagnoses !== undefined) patch.diagnoses = input.diagnoses;
    if (input.guardianName !== undefined) patch.guardian_name = input.guardianName;
    if (input.guardianPhone !== undefined) patch.guardian_phone = input.guardianPhone;
    if (input.guardianEmail !== undefined) patch.guardian_email = input.guardianEmail;
    if (input.guardianPin !== undefined) patch.guardian_pin = input.guardianPin;
    if (input.assignedDoctorId !== undefined) patch.assigned_doctor_id = input.assignedDoctorId;
    if (input.status !== undefined) patch.status = input.status;
    if (input.notes !== undefined) patch.notes = input.notes;
    await supabase.from("patients").update(patch).eq("id", id);
  },
  delete: async (id: string): Promise<void> => { await supabase.from("patients").delete().eq("id", id); },
};

// ── SESSIONS ──
export const SessionDB = {
  getAll: async (): Promise<Session[]> => {
    const { data } = await supabase.from("sessions").select("*").order("date", { ascending: false });
    return (data ?? []).map(mapSession);
  },
  getByPatient: async (patientId: string): Promise<Session[]> => {
    const { data } = await supabase.from("sessions").select("*").eq("patient_id", patientId).order("date", { ascending: false });
    return (data ?? []).map(mapSession);
  },
  create: async (input: Omit<Session, "id" | "createdAt">): Promise<Session> => {
    const { data, error } = await supabase.from("sessions").insert({
      patient_id: input.patientId, doctor_id: input.doctorId, date: input.date,
      duration_mins: input.durationMins, type: input.type, notes: input.notes,
      goals_addressed: input.goalsAddressed,
    }).select().single();
    if (error) throw error;
    return mapSession(data);
  },
  update: async (id: string, input: Partial<Session>): Promise<void> => {
    const patch: Record<string, unknown> = {};
    if (input.notes !== undefined) patch.notes = input.notes;
    if (input.durationMins !== undefined) patch.duration_mins = input.durationMins;
    if (input.type !== undefined) patch.type = input.type;
    if (input.date !== undefined) patch.date = input.date;
    await supabase.from("sessions").update(patch).eq("id", id);
  },
  delete: async (id: string): Promise<void> => { await supabase.from("sessions").delete().eq("id", id); },
};

// ── GOALS ──
export const GoalDB = {
  getByPatient: async (patientId: string): Promise<Goal[]> => {
    const { data } = await supabase.from("goals").select("*").eq("patient_id", patientId).order("created_at", { ascending: true });
    return (data ?? []).map(mapGoal);
  },
  create: async (input: Omit<Goal, "id" | "createdAt">): Promise<Goal> => {
    const { data, error } = await supabase.from("goals").insert({
      patient_id: input.patientId, title: input.title, description: input.description,
      target_date: input.targetDate, achieved_at: input.achievedAt,
    }).select().single();
    if (error) throw error;
    return mapGoal(data);
  },
  update: async (id: string, input: Partial<Goal>): Promise<void> => {
    const patch: Record<string, unknown> = {};
    if (input.title !== undefined) patch.title = input.title;
    if (input.description !== undefined) patch.description = input.description;
    if (input.targetDate !== undefined) patch.target_date = input.targetDate;
    if ("achievedAt" in input) patch.achieved_at = input.achievedAt ?? null;
    await supabase.from("goals").update(patch).eq("id", id);
  },
  delete: async (id: string): Promise<void> => { await supabase.from("goals").delete().eq("id", id); },
};

// ── BOOKINGS ──
export const BookingDB = {
  getAll: async (doctorId?: string): Promise<Booking[]> => {
    let q = supabase.from("bookings").select("*").order("datetime", { ascending: false });
    if (doctorId) q = q.eq("doctor_id", doctorId);
    const { data } = await q;
    return (data ?? []).map(mapBooking);
  },
  getById: async (id: string): Promise<Booking | undefined> => {
    const { data } = await supabase.from("bookings").select("*").eq("id", id).single();
    return data ? mapBooking(data) : undefined;
  },
  getByPatient: async (patientId: string): Promise<Booking[]> => {
    const { data } = await supabase.from("bookings").select("*").eq("patient_id", patientId).order("datetime", { ascending: false });
    return (data ?? []).map(mapBooking);
  },
  create: async (input: Omit<Booking, "id" | "createdAt">): Promise<Booking> => {
    const { data, error } = await supabase.from("bookings").insert({
      patient_id: input.patientId, doctor_id: input.doctorId, datetime: input.datetime,
      type: input.type, status: input.status, payment_status: input.paymentStatus,
      amount: input.amount, zoom_link: input.zoomLink, notes: input.notes,
    }).select().single();
    if (error) throw error;
    return mapBooking(data);
  },
  update: async (id: string, input: Partial<Booking>): Promise<void> => {
    const patch: Record<string, unknown> = {};
    if (input.status !== undefined) patch.status = input.status;
    if (input.paymentStatus !== undefined) patch.payment_status = input.paymentStatus;
    if (input.datetime !== undefined) patch.datetime = input.datetime;
    if (input.zoomLink !== undefined) patch.zoom_link = input.zoomLink;
    if (input.notes !== undefined) patch.notes = input.notes;
    if (input.amount !== undefined) patch.amount = input.amount;
    await supabase.from("bookings").update(patch).eq("id", id);
  },
  delete: async (id: string): Promise<void> => { await supabase.from("bookings").delete().eq("id", id); },
};

// ── BLOG ──
export const BlogDB = {
  getAll: async (): Promise<BlogPost[]> => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    return (data ?? []).map(mapBlog);
  },
  getById: async (id: string): Promise<BlogPost | undefined> => {
    const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();
    return data ? mapBlog(data) : undefined;
  },
  getBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
    return data ? mapBlog(data) : undefined;
  },
  create: async (input: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> => {
    const { data, error } = await supabase.from("blog_posts").insert({
      slug: input.slug, title: input.title, content: input.content,
      cover_image: input.coverImage, category: input.category, excerpt: input.excerpt,
      published: input.published, published_at: input.publishedAt, author_id: input.authorId,
    }).select().single();
    if (error) throw error;
    return mapBlog(data);
  },
  update: async (id: string, input: Partial<BlogPost>): Promise<void> => {
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (input.title !== undefined) patch.title = input.title;
    if (input.content !== undefined) patch.content = input.content;
    if (input.coverImage !== undefined) patch.cover_image = input.coverImage;
    if (input.excerpt !== undefined) patch.excerpt = input.excerpt;
    if (input.published !== undefined) patch.published = input.published;
    if (input.publishedAt !== undefined) patch.published_at = input.publishedAt;
    if (input.category !== undefined) patch.category = input.category;
    if (input.slug !== undefined) patch.slug = input.slug;
    await supabase.from("blog_posts").update(patch).eq("id", id);
  },
  delete: async (id: string): Promise<void> => { await supabase.from("blog_posts").delete().eq("id", id); },
};

// ── SITE CONTENT (CMS) ──
export const ContentDB = {
  get: async (): Promise<SiteContent> => {
    const { data } = await supabase.from("site_content").select("key, value");
    if (!data || data.length === 0) return DEFAULT_CONTENT;
    return data.reduce<SiteContent>((acc, row) => { acc[row.key] = row.value; return acc; }, {});
  },
  setMany: async (updates: SiteContent): Promise<void> => {
    const rows = Object.entries(updates).map(([key, value]) => ({ key, value: String(value) }));
    await supabase.from("site_content").upsert(rows, { onConflict: "key" });
  },
};

export const DEFAULT_CONTENT: SiteContent = {
  "hero.title": "Every Child Has Wings.",
  "hero.subtitle": "We help children with autism, ADHD, sensory challenges, and developmental delays reach their full potential.",
  "hero.ctaText": "Book Online Consultation",
  "hero.badge": "Pediatric Occupational Therapy · Katni, India",
  "doctor.name": "Dr. Prasoon Gupta",
  "doctor.qualifications": "BOT · MOT — Pediatric OT",
  "doctor.bio": "With over 3 years of clinical experience and 400+ children helped, Dr. Prasoon combines evidence-based occupational therapy with a warm, child-centred approach.",
  "doctor.experience": "3+ years",
  "doctor.patientsHelped": "400+",
  "contact.phone": "+91 83497 64084",
  "contact.whatsapp": "918349764084",
  "contact.address": "Udaan Care, Katni, Madhya Pradesh",
  "contact.email": "info@udaancare.in",
  "pricing.india": 599,
  "pricing.international": 9,
  "colors.primary": "#0A7E8C",
  "colors.accent": "#6B3FA0",
  "fonts.heading": "Nunito",
  "fonts.body": "DM Sans",
  "seo.siteTitle": "Udaan Care — Pediatric Occupational Therapy",
  "seo.description": "Expert pediatric OT for children with autism, ADHD, sensory processing disorder. Dr. Prasoon Gupta, Katni MP. Online & in-clinic.",
};

// ── LEADS ────────────────────────────────────────────────────────────────────
function mapLead(r: Record<string, unknown>): Lead {
  return {
    id: r.id as string, name: r.name as string, phone: r.phone as string, email: r.email as string | undefined,
    source: r.source as Lead["source"], serviceInterest: r.service_interest as string | undefined,
    message: r.message as string | undefined, status: r.status as Lead["status"],
    notes: r.notes as string | undefined, doctorId: r.doctor_id as string | undefined,
    createdAt: r.created_at as string,
  };
}

export const LeadDB = {
  getAll: async (doctorId?: string): Promise<Lead[]> => {
    let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (doctorId) q = q.eq("doctor_id", doctorId);
    const { data } = await q;
    return (data ?? []).map(mapLead);
  },
  getByStatus: async (status: Lead["status"], doctorId?: string): Promise<Lead[]> => {
    let q = supabase.from("leads").select("*").eq("status", status).order("created_at", { ascending: false });
    if (doctorId) q = q.eq("doctor_id", doctorId);
    const { data } = await q;
    return (data ?? []).map(mapLead);
  },
  create: async (lead: Omit<Lead, "id" | "createdAt">): Promise<Lead | null> => {
    const { data, error } = await supabase.from("leads").insert([{
      name: lead.name, phone: lead.phone, email: lead.email,
      source: lead.source, service_interest: lead.serviceInterest,
      message: lead.message, status: lead.status ?? "new", notes: lead.notes,
      doctor_id: lead.doctorId,
    }]).select().single();
    if (error) { console.error("LeadDB.create:", error); return null; }
    return data ? mapLead(data) : null;
  },
  updateStatus: async (id: string, status: Lead["status"], notes?: string): Promise<void> => {
    await supabase.from("leads").update({ status, notes, updated_at: new Date().toISOString() }).eq("id", id);
  },
  assignDoctor: async (id: string, doctorId: string | null): Promise<void> => {
    await supabase.from("leads").update({ doctor_id: doctorId, updated_at: new Date().toISOString() }).eq("id", id);
  },
  delete: async (id: string): Promise<void> => {
    await supabase.from("leads").delete().eq("id", id);
  },
};

// ── DOCTOR AVAILABILITY ───────────────────────────────────────────────────────
function mapAvailability(r: Record<string, unknown>): DoctorAvailability {
  return {
    id: r.id as string,
    workingDays: (r.working_days as number[]) ?? [1,2,3,4,5,6],
    startTime: r.start_time as string ?? "10:00",
    endTime: r.end_time as string ?? "19:00",
    breakStart: r.break_start as string | undefined,
    breakEnd: r.break_end as string | undefined,
    sessionDurationMins: (r.session_duration_mins as number) ?? 45,
    bufferMins: (r.buffer_mins as number) ?? 10,
    updatedAt: r.updated_at as string,
  };
}

export const AvailabilityDB = {
  get: async (): Promise<DoctorAvailability | null> => {
    const { data } = await supabase.from("doctor_availability").select("*").limit(1).single();
    return data ? mapAvailability(data) : null;
  },
  upsert: async (avail: Omit<DoctorAvailability, "id" | "updatedAt">): Promise<DoctorAvailability | null> => {
    // Get existing or create
    const existing = await AvailabilityDB.get();
    const payload = {
      working_days: avail.workingDays,
      start_time: avail.startTime,
      end_time: avail.endTime,
      break_start: avail.breakStart,
      break_end: avail.breakEnd,
      session_duration_mins: avail.sessionDurationMins,
      buffer_mins: avail.bufferMins,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = existing
      ? await supabase.from("doctor_availability").update(payload).eq("id", existing.id).select().single()
      : await supabase.from("doctor_availability").insert([payload]).select().single();
    if (error) { console.error("AvailabilityDB.upsert:", error); return null; }
    return data ? mapAvailability(data) : null;
  },
};

// ── BLOCKED DATES ─────────────────────────────────────────────────────────────
function mapBlockedDate(r: Record<string, unknown>): BlockedDate {
  return { id: r.id as string, date: r.date as string, reason: r.reason as string | undefined, createdAt: r.created_at as string };
}

export const BlockedDateDB = {
  getAll: async (): Promise<BlockedDate[]> => {
    const { data } = await supabase.from("blocked_dates").select("*").order("date", { ascending: true });
    return (data ?? []).map(mapBlockedDate);
  },
  getUpcoming: async (): Promise<BlockedDate[]> => {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase.from("blocked_dates").select("*").gte("date", today).order("date");
    return (data ?? []).map(mapBlockedDate);
  },
  create: async (date: string, reason?: string): Promise<BlockedDate | null> => {
    const { data, error } = await supabase.from("blocked_dates").insert([{ date, reason }]).select().single();
    if (error) { console.error("BlockedDateDB.create:", error); return null; }
    return data ? mapBlockedDate(data) : null;
  },
  delete: async (id: string): Promise<void> => {
    await supabase.from("blocked_dates").delete().eq("id", id);
  },
};

// ── BRANCHES ──────────────────────────────────────────────────────────────────
function mapBranch(r: Record<string, unknown>): Branch {
  return {
    id: r.id as string, name: r.name as string, city: r.city as string,
    address: r.address as string | undefined, phone: r.phone as string | undefined,
    managerId: r.manager_id as string | undefined, isActive: r.is_active as boolean,
    createdAt: r.created_at as string,
  };
}
export const BranchDB = {
  getAll: async (): Promise<Branch[]> => {
    const { data } = await supabase.from("branches").select("*").order("name");
    return (data ?? []).map(mapBranch);
  },
  getActive: async (): Promise<Branch[]> => {
    const { data } = await supabase.from("branches").select("*").eq("is_active", true).order("name");
    return (data ?? []).map(mapBranch);
  },
  create: async (b: Omit<Branch, "id" | "createdAt">): Promise<Branch | null> => {
    const { data, error } = await supabase.from("branches").insert([{
      name: b.name, city: b.city, address: b.address, phone: b.phone,
      manager_id: b.managerId, is_active: b.isActive ?? true,
    }]).select().single();
    if (error) { console.error("BranchDB.create:", error); return null; }
    return data ? mapBranch(data) : null;
  },
  update: async (id: string, b: Partial<Omit<Branch, "id" | "createdAt">>): Promise<void> => {
    await supabase.from("branches").update({
      name: b.name, city: b.city, address: b.address, phone: b.phone,
      manager_id: b.managerId, is_active: b.isActive,
    }).eq("id", id);
  },
};

// ── STAFF ATTENDANCE ──────────────────────────────────────────────────────────
function mapAttendance(r: Record<string, unknown>): StaffAttendance {
  return {
    id: r.id as string, userId: r.user_id as string, branchId: r.branch_id as string | undefined,
    date: r.date as string, clockIn: r.clock_in as string | undefined,
    clockOut: r.clock_out as string | undefined,
    status: (r.status as StaffAttendance["status"]) ?? "absent",
    leaveType: r.leave_type as StaffAttendance["leaveType"],
    notes: r.notes as string | undefined,
    createdAt: r.created_at as string, updatedAt: r.updated_at as string,
  };
}
export const AttendanceDB = {
  getByDate: async (date: string, branchId?: string): Promise<StaffAttendance[]> => {
    let q = supabase.from("staff_attendance").select("*").eq("date", date);
    if (branchId) q = q.eq("branch_id", branchId);
    const { data } = await q.order("clock_in");
    return (data ?? []).map(mapAttendance);
  },
  getByUser: async (userId: string, fromDate: string, toDate: string): Promise<StaffAttendance[]> => {
    const { data } = await supabase.from("staff_attendance").select("*")
      .eq("user_id", userId).gte("date", fromDate).lte("date", toDate).order("date", { ascending: false });
    return (data ?? []).map(mapAttendance);
  },
  clockIn: async (userId: string, branchId?: string): Promise<StaffAttendance | null> => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase.from("staff_attendance").upsert([{
      user_id: userId, branch_id: branchId, date: today,
      clock_in: new Date().toISOString(), status: "present",
      updated_at: new Date().toISOString(),
    }], { onConflict: "user_id,date" }).select().single();
    if (error) { console.error("AttendanceDB.clockIn:", error); return null; }
    return data ? mapAttendance(data) : null;
  },
  clockOut: async (userId: string): Promise<void> => {
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("staff_attendance").update({
      clock_out: new Date().toISOString(), updated_at: new Date().toISOString(),
    }).eq("user_id", userId).eq("date", today);
  },
  markStatus: async (userId: string, date: string, status: StaffAttendance["status"], leaveType?: string, notes?: string): Promise<void> => {
    await supabase.from("staff_attendance").upsert([{
      user_id: userId, date, status, leave_type: leaveType, notes,
      updated_at: new Date().toISOString(),
    }], { onConflict: "user_id,date" });
  },
  getTodayForUser: async (userId: string): Promise<StaffAttendance | null> => {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase.from("staff_attendance").select("*").eq("user_id", userId).eq("date", today).single();
    return data ? mapAttendance(data) : null;
  },
  getMonthSummary: async (userId: string, year: number, month: number): Promise<StaffAttendance[]> => {
    const from = `${year}-${String(month).padStart(2,"0")}-01`;
    const to   = `${year}-${String(month).padStart(2,"0")}-31`;
    const { data } = await supabase.from("staff_attendance").select("*")
      .eq("user_id", userId).gte("date", from).lte("date", to).order("date");
    return (data ?? []).map(mapAttendance);
  },
};

// ── STAFF ACTIVITIES ──────────────────────────────────────────────────────────
function mapActivity(r: Record<string, unknown>): StaffActivity {
  return {
    id: r.id as string, userId: r.user_id as string, branchId: r.branch_id as string | undefined,
    date: r.date as string, activityType: r.activity_type as ActivityType,
    patientId: r.patient_id as string | undefined, title: r.title as string,
    durationMins: (r.duration_mins as number) ?? 0, notes: r.notes as string | undefined,
    startTime: r.start_time as string | undefined, createdAt: r.created_at as string,
  };
}
export const ActivityDB = {
  getByDate: async (userId: string, date: string): Promise<StaffActivity[]> => {
    const { data } = await supabase.from("staff_activities").select("*")
      .eq("user_id", userId).eq("date", date).order("created_at");
    return (data ?? []).map(mapActivity);
  },
  getByDateRange: async (userId: string, from: string, to: string): Promise<StaffActivity[]> => {
    const { data } = await supabase.from("staff_activities").select("*")
      .eq("user_id", userId).gte("date", from).lte("date", to).order("date").order("created_at");
    return (data ?? []).map(mapActivity);
  },
  getAllByDate: async (date: string, branchId?: string): Promise<StaffActivity[]> => {
    let q = supabase.from("staff_activities").select("*").eq("date", date);
    if (branchId) q = q.eq("branch_id", branchId);
    const { data } = await q.order("user_id").order("created_at");
    return (data ?? []).map(mapActivity);
  },
  create: async (a: Omit<StaffActivity, "id" | "createdAt">): Promise<StaffActivity | null> => {
    const { data, error } = await supabase.from("staff_activities").insert([{
      user_id: a.userId, branch_id: a.branchId, date: a.date,
      activity_type: a.activityType, patient_id: a.patientId,
      title: a.title, duration_mins: a.durationMins,
      notes: a.notes, start_time: a.startTime,
    }]).select().single();
    if (error) { console.error("ActivityDB.create:", error); return null; }
    return data ? mapActivity(data) : null;
  },
  update: async (id: string, a: Partial<Omit<StaffActivity, "id" | "userId" | "createdAt">>): Promise<void> => {
    await supabase.from("staff_activities").update({
      activity_type: a.activityType, title: a.title,
      duration_mins: a.durationMins, notes: a.notes, patient_id: a.patientId,
    }).eq("id", id);
  },
  delete: async (id: string): Promise<void> => {
    await supabase.from("staff_activities").delete().eq("id", id);
  },
};

// ── LEAVE REQUESTS ────────────────────────────────────────────────────────────
function mapLeaveReq(r: Record<string, unknown>): LeaveRequest {
  return {
    id: r.id as string, userId: r.user_id as string,
    fromDate: r.from_date as string, toDate: r.to_date as string,
    leaveType: r.leave_type as LeaveRequest["leaveType"],
    reason: r.reason as string | undefined,
    status: r.status as LeaveRequest["status"],
    approvedBy: r.approved_by as string | undefined,
    approvedAt: r.approved_at as string | undefined,
    createdAt: r.created_at as string,
  };
}
export const LeaveRequestDB = {
  getAll: async (): Promise<LeaveRequest[]> => {
    const { data } = await supabase.from("leave_requests").select("*").order("created_at", { ascending: false });
    return (data ?? []).map(mapLeaveReq);
  },
  getPending: async (): Promise<LeaveRequest[]> => {
    const { data } = await supabase.from("leave_requests").select("*").eq("status", "pending").order("from_date");
    return (data ?? []).map(mapLeaveReq);
  },
  create: async (req: Omit<LeaveRequest, "id" | "status" | "approvedBy" | "approvedAt" | "createdAt">): Promise<LeaveRequest | null> => {
    const { data, error } = await supabase.from("leave_requests").insert([{
      user_id: req.userId, from_date: req.fromDate, to_date: req.toDate,
      leave_type: req.leaveType, reason: req.reason, status: "pending",
    }]).select().single();
    if (error) { console.error("LeaveRequestDB.create:", error); return null; }
    return data ? mapLeaveReq(data) : null;
  },
  approve: async (id: string, approverId: string): Promise<void> => {
    await supabase.from("leave_requests").update({
      status: "approved", approved_by: approverId, approved_at: new Date().toISOString(),
    }).eq("id", id);
  },
  reject: async (id: string, approverId: string): Promise<void> => {
    await supabase.from("leave_requests").update({
      status: "rejected", approved_by: approverId, approved_at: new Date().toISOString(),
    }).eq("id", id);
  },
};

// ═══════════════════════════════════════════════════════════════
// VideoTestimonialDB
// ═══════════════════════════════════════════════════════════════
function mapVideoTestimonial(r: Record<string, unknown>): VideoTestimonial {
  return {
    id:           r.id as string,
    parentName:   r.parent_name as string,
    childAge:     r.child_age as string | undefined,
    location:     r.location as string | undefined,
    caption:      r.caption as string | undefined,
    videoUrl:     r.video_url as string,
    thumbnailUrl: r.thumbnail_url as string | undefined,
    isActive:     r.is_active as boolean,
    sortOrder:    r.sort_order as number ?? 0,
    createdAt:    r.created_at as string,
  };
}

export const VideoTestimonialDB = {
  // All active — for public website
  getActive: async (): Promise<VideoTestimonial[]> => {
    const { data, error } = await supabase
      .from("video_testimonials")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) { console.error("VideoTestimonialDB.getActive:", error); return []; }
    return (data ?? []).map(mapVideoTestimonial);
  },

  // All — for admin panel
  getAll: async (): Promise<VideoTestimonial[]> => {
    const { data, error } = await supabase
      .from("video_testimonials")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) { console.error("VideoTestimonialDB.getAll:", error); return []; }
    return (data ?? []).map(mapVideoTestimonial);
  },

  create: async (t: Omit<VideoTestimonial, "id" | "createdAt">): Promise<VideoTestimonial | null> => {
    const { data, error } = await supabase.from("video_testimonials").insert([{
      parent_name:   t.parentName,
      child_age:     t.childAge,
      location:      t.location,
      caption:       t.caption,
      video_url:     t.videoUrl,
      thumbnail_url: t.thumbnailUrl,
      is_active:     t.isActive ?? true,
      sort_order:    t.sortOrder ?? 0,
    }]).select().single();
    if (error) { console.error("VideoTestimonialDB.create:", error); return null; }
    return data ? mapVideoTestimonial(data) : null;
  },

  update: async (id: string, t: Partial<VideoTestimonial>): Promise<void> => {
    const patch: Record<string, unknown> = {};
    if (t.parentName   !== undefined) patch.parent_name   = t.parentName;
    if (t.childAge     !== undefined) patch.child_age     = t.childAge;
    if (t.location     !== undefined) patch.location      = t.location;
    if (t.caption      !== undefined) patch.caption       = t.caption;
    if (t.videoUrl     !== undefined) patch.video_url     = t.videoUrl;
    if (t.thumbnailUrl !== undefined) patch.thumbnail_url = t.thumbnailUrl;
    if (t.isActive     !== undefined) patch.is_active     = t.isActive;
    if (t.sortOrder    !== undefined) patch.sort_order    = t.sortOrder;
    await supabase.from("video_testimonials").update(patch).eq("id", id);
  },

  delete: async (id: string): Promise<void> => {
    await supabase.from("video_testimonials").delete().eq("id", id);
  },

  toggleActive: async (id: string, isActive: boolean): Promise<void> => {
    await supabase.from("video_testimonials").update({ is_active: isActive }).eq("id", id);
  },
};
