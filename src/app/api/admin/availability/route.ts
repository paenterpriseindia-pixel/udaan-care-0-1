import { NextResponse } from "next/server";
import { AvailabilityDB, BlockedDateDB } from "@/lib/db";

// GET /api/admin/availability — returns availability + blocked dates
export async function GET() {
  const [availability, blockedDates] = await Promise.all([
    AvailabilityDB.get(),
    BlockedDateDB.getUpcoming(),
  ]);
  return NextResponse.json({ availability, blockedDates });
}

// POST /api/admin/availability — upsert availability settings
export async function POST(req: Request) {
  const body = await req.json();
  const result = await AvailabilityDB.upsert({
    workingDays: body.workingDays ?? [1,2,3,4,5,6],
    startTime: body.startTime ?? "10:00",
    endTime: body.endTime ?? "19:00",
    breakStart: body.breakStart,
    breakEnd: body.breakEnd,
    sessionDurationMins: body.sessionDurationMins ?? 45,
    bufferMins: body.bufferMins ?? 10,
  });
  return result
    ? NextResponse.json(result)
    : NextResponse.json({ error: "Failed to save" }, { status: 500 });
}
