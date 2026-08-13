import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Get latest unused OTP
    const resetOTP = await prisma.passwordResetOTP.findFirst({
      where: {
        email: normalizedEmail,
        used: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!resetOTP) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date() > resetOTP.expiresAt) {
      await prisma.passwordResetOTP.update({
        where: {
          id: resetOTP.id,
        },
        data: {
          used: true,
        },
      });

      return NextResponse.json(
        { error: "OTP has expired. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Limit wrong attempts
    if (resetOTP.attempts >= 5) {
      await prisma.passwordResetOTP.update({
        where: {
          id: resetOTP.id,
        },
        data: {
          used: true,
        },
      });

      return NextResponse.json(
        { error: "Too many incorrect attempts. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Compare entered OTP with stored hash
    const isValid = await bcrypt.compare(
      otp.toString(),
      resetOTP.otpHash
    );

    if (!isValid) {
      await prisma.passwordResetOTP.update({
        where: {
          id: resetOTP.id,
        },
        data: {
          attempts: {
            increment: 1,
          },
        },
      });

      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "OTP verified successfully.",
      verified: true,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}