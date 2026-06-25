import { NextResponse } from "next/server";
import { ActivityDB } from "@/lib/db";

// GET /api/admin/staff/activities?userId=xxx&from=2025-06-01&to=2025-06-30
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const from   = searchParams.get("from");
  const to     = searchParams.get("to");

  if (!userId || !from || !to) {
    return NextResponse.json({ error: "userId, from, to required" }, { status: 400 });
  }

  const activities = await ActivityDB.getByDateRange(userId, from, to);
  return NextResponse.json(activities);
}

// POST /api/admin/staff/activities — create activity directly (used by admin)
export async function POST(req: Request) {
  const body = await req.json();
  const activity = await ActivityDB.create({
    userId:       body.userId,
    branchId:     body.branchId,
    date:         body.date ?? new Date().toISOString().split("T")[0],
    activityType: body.activityType ?? "other",
    patientId:    body.patientId,
    title:        body.title,
    durationMins: body.durationMins ?? 0,
    notes:        body.notes,
    startTime:    body.startTime,
  });
  return activity
    ? NextResponse.json(activity, { status: 201 })
    : NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
}

// DELETE /api/admin/staff/activities?id=xxx
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await ActivityDB.delete(id);
  return NextResponse.json({ ok: true });
}
