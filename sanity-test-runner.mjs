/**
 * Sanity test runner for the Account Provisioning MCP server.
 * Tests core provisioning tools against the live Cloudinary API.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const BASE = "http://localhost:2718";
const USE_STREAMABLE = process.argv.includes("--streamable");
let passed = 0, failed = 0, skipped = 0;

function log(label, ok, detail) {
  const mark = ok ? "PASS" : "FAIL";
  console.log(`[${mark}] ${label}${detail ? " — " + detail : ""}`);
  ok ? passed++ : failed++;
}

function skip(label, reason) {
  console.log(`[SKIP] ${label} — ${reason}`);
  skipped++;
}

async function callTool(client, name, args = {}) {
  const res = await client.callTool({ name, arguments: args });
  const text = res.content?.filter((c) => c.type === "text").map((c) => c.text).join("\n");
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  return { text, json, isError: res.isError };
}

async function main() {
  const RUN_ID = Date.now().toString(36);
  const PFX = `sdk-test-${RUN_ID}`;
  console.log(`\n=== Account Provisioning MCP Sanity Test (run ${RUN_ID}) ===\n`);

  const transport = USE_STREAMABLE
    ? new StreamableHTTPClientTransport(new URL("/mcp", BASE))
    : new SSEClientTransport(new URL("/sse", BASE));
  const client = new Client({ name: "sanity-test", version: "1.0.0" });
  await client.connect(transport);
  console.log(`Connected to MCP server (${USE_STREAMABLE ? "streamable HTTP" : "SSE"})\n`);

  // ─── Phase 1: Read-only (Product Environments) ───
  console.log("--- Phase 1: Read-only (Product Environments) ---\n");
  let envId;
  {
    const { json, isError } = await callTool(client, "product-environments-list");
    const count = json?.sub_accounts?.length ?? 0;
    envId = json?.sub_accounts?.[0]?.id;
    log("1.1 list product environments", !isError && count > 0, `${count} env(s)`);
  }
  if (envId) {
    const { json, isError } = await callTool(client, "product-environments-get", { sub_account_id: envId });
    log("1.2 get product environment", !isError && json?.id === envId, `id=${json?.id}`);
  }

  // ─── Phase 2: Read-only (Users) ───
  console.log("\n--- Phase 2: Read-only (Users) ---\n");
  let userId;
  {
    const { json, isError } = await callTool(client, "users-list");
    const count = json?.users?.length ?? 0;
    userId = json?.users?.[0]?.id;
    log("2.1 list users", !isError && count > 0, `${count} user(s)`);
  }
  if (userId) {
    const { json, isError } = await callTool(client, "users-get", { user_id: userId });
    log("2.2 get user", !isError && json?.id === userId, `id=${json?.id}`);
  }
  if (userId) {
    const { json, isError } = await callTool(client, "users-get-groups", { user_id: userId });
    log("2.3 get groups for user", !isError, `${json?.user_groups?.length ?? json?.groups?.length ?? 0} group(s)`);
  }

  // ─── Phase 3: Read-only (User Groups) ───
  console.log("\n--- Phase 3: Read-only (User Groups) ---\n");
  let groupId;
  {
    const { json, isError } = await callTool(client, "user-groups-list");
    const count = json?.user_groups?.length ?? 0;
    groupId = json?.user_groups?.[0]?.id;
    log("3.1 list user groups", !isError, `${count} group(s)`);
  }
  if (groupId) {
    const { json, isError } = await callTool(client, "user-groups-get", { group_id: groupId });
    log("3.2 get user group", !isError && json?.id === groupId, `id=${json?.id}`);
  }

  // ─── Phase 4: Read-only (Access Keys) ───
  console.log("\n--- Phase 4: Read-only (Access Keys) ---\n");
  if (envId) {
    const { json, isError } = await callTool(client, "access-keys-list", { sub_account_id: envId });
    log("4.1 list access keys", !isError, `${json?.access_keys?.length ?? 0} key(s)`);
  } else {
    skip("4.1 list access keys", "no product environment available");
  }

  // ─── Phase 5: Read-only (Billing) ───
  console.log("\n--- Phase 5: Read-only (Billing) ---\n");
  {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const dateStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}-01`;
    const { json, isError } = await callTool(client, "billing-usage-get", { date: dateStr });
    log("5.1 get billing usage", !isError, json?.plan ?? "no plan field");
  }

  // ─── Phase 6: Read-only (Permissions) ───
  console.log("\n--- Phase 6: Read-only (Permissions) ---\n");
  {
    const { json, isError } = await callTool(client, "get-catalog");
    log("6.1 get catalog", !isError, json?.catalog ? "has catalog" : "no catalog");
  }
  {
    const { json, isError } = await callTool(client, "get-schema");
    log("6.2 get Cedar schema", !isError, json?.schema ? "has schema" : "no schema");
  }
  {
    const { json, isError } = await callTool(client, "list-roles", { permission_type: "global" });
    log("6.3 list roles", !isError, `${json?.roles?.length ?? 0} role(s)`);
  }
  {
    const { json, isError } = await callTool(client, "list-system-policies", { permission_type: "global" });
    log("6.4 list system policies", !isError, `${json?.policies?.length ?? 0} policy(ies)`);
  }

  // ─── Summary ───
  console.log(`\n=== Summary: ${passed + failed + skipped} total, ${passed} passed, ${failed} failed, ${skipped} skipped ===\n`);

  await client.close();
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => { console.error("Fatal:", err); process.exit(2); });
