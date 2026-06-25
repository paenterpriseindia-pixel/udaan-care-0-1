import { NextResponse } from "next/server";
import { AttendanceDB, ActivityDB, UserDB } from "@/lib/db";

// GET /api/admin/staff/tracker?date=2025-06-24&branchId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date     = searchParams.get("date") ?? new Date().toISOString().split("T")[0];
  const branchId = searchParams.get("branchId") ?? undefined;
  const userId   = searchParams.get("userId");

  if (userId) {
    // Single user tracker
    const [attendance, activities] = await Promise.all([
      AttendanceDB.getTodayForUser(userId),
      ActivityDB.getByDate(userId, date),
    ]);
    return NextResponse.json({ attendance, activities });
  }

  // All staff for today (admin view)
  const [users, attendances, activities] = await Promise.all([
    UserDB.getAll(),
    AttendanceDB.getByDate(date, branchId),
    ActivityDB.getAllByDate(date, branchId),
  ]);

  const staff = users.filter(u => u.role === "ADMIN" || u.role === "DOCTOR");
  return NextResponse.json({ staff, attendances, activities, date });
}

// POST /api/admin/staff/tracker — clock in / clock out / add activity / mark status
export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;

  switch (action) {
    case "clock_in": {
      const result = await AttendanceDB.clockIn(body.userId, body.branchId);
      return result ? NextResponse.json(result) : NextResponse.json({ error: "Clock-in failed" }, { status: 500 });
    }
    case "clock_out": {
      await AttendanceDB.clockOut(body.userId);
      return NextResponse.json({ ok: true });
    }
    case "mark_status": {
      await AttendanceDB.markStatus(body.userId, body.date, body.status, body.leaveType, body.notes);
      return NextResponse.json({ ok: true });
    }
    case "add_activity": {
      const today = new Date().toISOString().split("T")[0];
      const result = await ActivityDB.create({
        userId: body.userId, branchId: body.branchId,
        date: body.date ?? today,
        activityType: body.activityType ?? "other",
        patientId: body.patientId,
        title: body.title, durationMins: body.durationMins ?? 0,
        notes: body.notes, startTime: body.startTime,
      });
      return result ? NextResponse.json(result, { status: 201 }) : NextResponse.json({ error: "Failed" }, { status: 500 });
    }
    case "delete_activity": {
      await ActivityDB.delete(body.activityId);
      return NextResponse.json({ ok: true });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
