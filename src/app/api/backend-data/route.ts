import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const ALLOWED_TABLES = new Set([
  "faculty",
  "tasks",
  "meetings",
  "documents",
  "announcements",
  "departments",
  "approvals",
]);

const ORDER_BY: Record<string, { column: string; ascending?: boolean }> = {
  tasks: { column: "due_date", ascending: true },
  meetings: { column: "meeting_date", ascending: false },
  documents: { column: "created_at", ascending: false },
  announcements: { column: "created_at", ascending: false },
};

async function createBackendClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (url && serviceKey) {
    return {
      client: createClient(url, serviceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }),
      usingServiceRole: true,
    };
  }

  return {
    client: await createServerSupabaseClient(),
    usingServiceRole: false,
  };
}

export async function GET(request: NextRequest) {
  const table = request.nextUrl.searchParams.get("table") ?? "";

  if (!ALLOWED_TABLES.has(table)) {
    return NextResponse.json(
      { data: [], error: `Unsupported table "${table}".` },
      { status: 400 }
    );
  }

  const authClient = await createServerSupabaseClient();
  const { data: authData, error: authError } = await authClient.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json(
      { data: [], error: "Authentication required." },
      { status: 401 }
    );
  }

  const { client, usingServiceRole } = await createBackendClient();
  let query = client.from(table).select("*");
  const order = ORDER_BY[table];

  if (order) {
    query = query.order(order.column, { ascending: order.ascending ?? true });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      {
        data: [],
        error: error.message,
        usingServiceRole,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: data ?? [],
    usingServiceRole,
    serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY),
  });
}
