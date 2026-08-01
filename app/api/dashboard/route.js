import { NextResponse } from "next/server";
import {
  adminProfile,
  bookings,
  metrics,
  userRegistrations,
} from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      profile: adminProfile,
      metrics,
      bookings,
      users: userRegistrations,
    },
  });
}
