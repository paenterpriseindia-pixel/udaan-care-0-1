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
  paymentStatus: "UNPAID" | "PAID";
  amount: number;
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
  getAll: async (): Promise<Patient[]> => {
    const { data } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
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
  getAll: async (): Promise<Booking[]> => {
    const { data } = await supabase.from("bookings").select("*").order("datetime", { ascending: false });
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
