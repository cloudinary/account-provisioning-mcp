# Security Considerations

The Cloudinary Account Provisioning MCP server handles **organization-level credentials** (`CLOUDINARY_PROVISIONING_API_KEY` and `CLOUDINARY_PROVISIONING_API_SECRET`) that can manage sub-accounts, users, roles, and access keys across your entire Cloudinary organization. Take the following precautions:

## Network Binding

By default, the HTTP transports (`serve` and `start --transport sse`) bind to **`127.0.0.1`** (localhost only). This prevents other devices on the network from connecting to the server.

If you need to expose the server to the network (e.g., in a Docker container), pass `--host 0.0.0.0` explicitly. When doing so, ensure you have appropriate network-level access controls (firewall rules, VPN, etc.) in place.

## CORS / Cross-Origin Requests

The `serve` command does **not** set permissive CORS headers by default. If you need to allow specific web origins to connect (e.g., a browser-based MCP client), use the `--allowed-origins` flag:

```sh
npx @cloudinary/account-provisioning-mcp serve --allowed-origins http://localhost:3000
```

Without explicit allowed origins, cross-origin requests will be rejected by the browser's same-origin policy.

## Secret Redaction

Tool results from `access-keys-list` and `access-keys-generate` may contain `api_secret` fields in the Cloudinary API response. These secrets are **automatically redacted** before being returned to the LLM context, preventing credential exposure to the model and any downstream logging.

To view the actual secret values, use the [Cloudinary Console](https://console.cloudinary.com/) directly.

## Recommendations

1. **Never expose this server to the public internet** without authentication. The MCP protocol does not include built-in authentication for HTTP transports.
2. **Use stdio transport** when running locally with a single MCP client (most secure — no network exposure at all).
3. **Rotate provisioning API credentials** if you suspect they may have been exposed.
4. **Use scopes** (`--scope`) to limit which tools are available, following the principle of least privilege.
