import { NextResponse } from "next/server";
import { updateUserStatus } from "@/lib/data";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const status = body?.status;

  if (!["approved", "declined"].includes(status)) {
    return NextResponse.json(
      { success: false, message: "Status must be approved or declined." },
      { status: 400 }
    );
  }

  const user = updateUserStatus(id, status);

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: user });
}
