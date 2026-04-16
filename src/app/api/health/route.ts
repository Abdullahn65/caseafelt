import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/health — lightweight health check for monitoring.
 * Returns 200 if the app can reach the database.
 */
export async function GET() {
  try {
    // Test database connectivity with a simple query
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error.message,
      },
      { status: 503 }
    );
  }
}
