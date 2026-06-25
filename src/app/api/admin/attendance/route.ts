import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { StaffAttendance } from "@/lib/db";

// GET /api/admin/attendance?from=2025-06-01&to=2025-06-30&userId=xxx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from     = searchParams.get("from");
  const to       = searchParams.get("to");
  const userId   = searchParams.get("userId");
  const branchId = searchParams.get("branchId");

  if (!from || !to) {
    return NextResponse.json({ error: "from and to dates required" }, { status: 400 });
  }

  let query = supabase
    .from("staff_attendance")
    .select("*")
    .gte("date", from)
    .lte("date", to)
    .order("date")
    .order("user_id");

  if (userId)   query = query.eq("user_id", userId);
  if (branchId) query = query.eq("branch_id", branchId);

  const { data, error } = await query;
  if (error) {
    console.error("AttendanceRangeAPI:", error);
    return NextResponse.json([], { status: 200 }); // graceful degradation
  }

  const records: StaffAttendance[] = (data ?? []).map(r => ({
    id: r.id, userId: r.user_id, branchId: r.branch_id,
    date: r.date, clockIn: r.clock_in, clockOut: r.clock_out,
    status: r.status, leaveType: r.leave_type, notes: r.notes,
    createdAt: r.created_at, updatedAt: r.updated_at,
  }));

  return NextResponse.json(records);
}
