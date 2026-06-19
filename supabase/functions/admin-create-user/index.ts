type AdminRole = "SUPER_ADMIN" | "ADMIN" | "PASTOR" | "EDITOR" | "CARE_TEAM";

type AdminPermission =
  | "MANAGE_ADMINS"
  | "MANAGE_CMS"
  | "MANAGE_CARE"
  | "MANAGE_MEMBERS"
  | "MANAGE_GIVING"
  | "VIEW_DASHBOARD";

type AdminProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: AdminRole;
  permissions: AdminPermission[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type CreateAdminInput = {
  fullName?: string | null;
  email?: string;
  password?: string;
  role?: AdminRole;
  permissions?: AdminPermission[];
};

const allowedRoles: AdminRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "PASTOR",
  "EDITOR",
  "CARE_TEAM",
];

const allowedPermissions: AdminPermission[] = [
  "MANAGE_ADMINS",
  "MANAGE_CMS",
  "MANAGE_CARE",
  "MANAGE_MEMBERS",
  "MANAGE_GIVING",
  "VIEW_DASHBOARD",
];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function getEnv(name: string): string {
  const value = Deno.env.get(name)?.trim();

  if (!value) {
    throw new Error(`Missing required secret: ${name}`);
  }

  return value;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function uniquePermissions(values: unknown): AdminPermission[] {
  if (!Array.isArray(values)) return [];

  return Array.from(
    new Set(
      values.filter((value): value is AdminPermission =>
        allowedPermissions.includes(value as AdminPermission),
      ),
    ),
  );
}

async function readJson<T>(body: { text(): Promise<string> }): Promise<T | null> {
  const text = await body.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function fetchSupabase(
  path: string,
  init: RequestInit,
  supabaseUrl: string,
  serviceRoleKey: string,
) {
  return fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(init.headers ?? {}),
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let supabaseUrl = "";
  let serviceRoleKey = "";

  try {
    supabaseUrl = getEnv("SUPABASE_URL");
    serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Missing secrets" },
      500,
    );
  }

  const callerToken = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!callerToken) {
    return jsonResponse({ error: "Missing authorization token" }, 401);
  }

  const callerResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${callerToken}`,
    },
  });

  const caller = await readJson<{ id?: string; email?: string }>(
    callerResponse,
  );

  if (!callerResponse.ok || !caller?.id) {
    return jsonResponse({ error: "Invalid authorization token" }, 401);
  }

  const profileResponse = await fetchSupabase(
    `/rest/v1/admin_profiles?id=eq.${encodeURIComponent(caller.id)}&select=*`,
    { method: "GET" },
    supabaseUrl,
    serviceRoleKey,
  );

  const profiles = await readJson<AdminProfileRow[]>(profileResponse);
  const callerProfile = profiles?.[0] ?? null;

  const canManageAdmins =
    callerProfile?.is_active === true &&
    (callerProfile.role === "SUPER_ADMIN" ||
      callerProfile.permissions.includes("MANAGE_ADMINS"));

  if (!canManageAdmins) {
    return jsonResponse(
      { error: "You do not have permission to create administrators." },
      403,
    );
  }

  const input = await readJson<CreateAdminInput>(req);

  if (!input) {
    return jsonResponse({ error: "Invalid request body" }, 400);
  }

  const email = input.email?.trim().toLowerCase() ?? "";
  const password = input.password ?? "";
  const role = input.role ?? "ADMIN";

  if (!isValidEmail(email)) {
    return jsonResponse({ error: "A valid email address is required." }, 400);
  }

  if (password.length < 8) {
    return jsonResponse(
      { error: "Password must be at least 8 characters." },
      400,
    );
  }

  if (!allowedRoles.includes(role)) {
    return jsonResponse({ error: "Invalid administrator role." }, 400);
  }

  if (role === "SUPER_ADMIN" && callerProfile?.role !== "SUPER_ADMIN") {
    return jsonResponse(
      { error: "Only super admins can create another super admin." },
      403,
    );
  }

  const permissions = uniquePermissions(input.permissions);
  const fullName = input.fullName?.trim() || null;

  const createUserResponse = await fetchSupabase(
    "/auth/v1/admin/users",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        },
      }),
    },
    supabaseUrl,
    serviceRoleKey,
  );

  const createdUser = await readJson<{ id?: string; error?: string }>(
    createUserResponse,
  );

  if (!createUserResponse.ok || !createdUser?.id) {
    return jsonResponse(
      {
        error:
          createdUser?.error ??
          "Unable to create the Supabase Auth administrator user.",
      },
      createUserResponse.status,
    );
  }

  const profileInsertResponse = await fetchSupabase(
    "/rest/v1/admin_profiles?select=*",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        id: createdUser.id,
        full_name: fullName,
        email,
        role,
        permissions,
        is_active: true,
      }),
    },
    supabaseUrl,
    serviceRoleKey,
  );

  const insertedProfiles = await readJson<AdminProfileRow[]>(
    profileInsertResponse,
  );

  if (!profileInsertResponse.ok || !insertedProfiles?.[0]) {
    await fetchSupabase(
      `/auth/v1/admin/users/${encodeURIComponent(createdUser.id)}`,
      { method: "DELETE" },
      supabaseUrl,
      serviceRoleKey,
    );

    return jsonResponse(
      { error: "Auth user was created, but the admin profile could not be saved." },
      profileInsertResponse.status,
    );
  }

  return jsonResponse({ data: insertedProfiles[0] }, 201);
});
