# Cloudinary Account Provisioning MCP Server

<!-- mcp-name: io.github.cloudinary/account-provisioning-mcp -->

<!-- Start Summary [summary] -->
## Summary

Cloudinary Account Provisioning API: Accounts with provisioning API access can create and manage their **product environments**, **users** and **user groups** using the RESTful Provisioning API.

Provisioning API access is available [upon request](https://cloudinary.com/contact?plan=enterprise) for accounts on an [Enterprise plan](https://cloudinary.com/pricing#pricing-enterprise).

The API uses **Basic Authentication** over HTTPS. Your **Account API Key** and **Account API Secret** (previously referred to as **Provisioning API keys**) are used for the authentication. These credentials (as well as your ACCOUNT_ID) are located in the [Cloudinary Console](https://console.cloudinary.com/pm) under **Settings > Account API Keys**.

The Provisioning API has dedicated SDKs for the following languages:

* [JavaScript](https://github.com/cloudinary/account-provisioning-js)
* [PHP](https://github.com/cloudinary/account-provisioning-php)
* [Java](https://github.com/cloudinary/account-provisioning-java)

Useful links:
* [Provisioning API reference (Classic)](https://cloudinary.com/documentation/provisioning_api_1) (includes SDKs for additional languages)

Accounts with Permissions API access can assign roles, made up of system policies, to control what principals (users, groups, and API keys) can do across the Cloudinary account and product environments. For more information about Cloudinary roles and permissions, see the [Role-based permissions](permissions_overview) guide.

Permissions API access is available [upon request](https://cloudinary.com/contact?plan=enterprise) for accounts on an [Enterprise plan](https://cloudinary.com/pricing#pricing-enterprise).

The API uses **Basic Authentication** over HTTPS. Your **Account API Key** and **Account API Secret** (previously referred to as **Provisioning API keys**) are used for the authentication. These credentials (as well as your ACCOUNT_ID) are located in the [Cloudinary Console](https://console.cloudinary.com/app/settings/account-api-keys) under **Settings > Account API Keys**.

_**Important:**_

_Cloudinary's **Roles and Permissions Management** is now available as a **Beta**. This is an early stage release, and while it's functional and ready for real-world testing, it's subject to change as we continue refining the experience based on what we learn, including your feedback.
During the Beta period, core functionality is considered stable, though some APIs, scopes, or response formats may evolve._

_**How you can help:**_

* _Use Roles and Permissions Management in real projects, prototypes, or tests._
* _Share feedback, issues, or ideas with our support team._

_Thank you for exploring this early release and helping us shape these tools to best meet your needs._
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [Cloudinary Account Provisioning MCP Server](#cloudinary-account-provisioning-mcp-server)
  * [Installation](#installation)
  * [Configuration](#configuration)
  * [Authentication](#authentication)
  * [Available Tools](#available-tools)
  * [Progressive Discovery](#progressive-discovery)
* [Development](#development)
  * [Building from Source](#building-from-source)
  * [Publishing to Anthropic MCP Registry](#publishing-to-anthropic-mcp-registry)
  * [Contributions](#contributions)

<!-- End Table of Contents [toc] -->

<!-- Start Installation [installation] -->
## Installation

The MCP server requires Node.js 20 or later.
<details>
<summary>Claude Desktop</summary>

Install the MCP server as a Desktop Extension using the pre-built [`mcp-server.mcpb`](https://github.com/cloudinary/account-provisioning-mcp/releases/download/v0.1.2/mcp-server.mcpb) file:

Simply drag and drop the [`mcp-server.mcpb`](https://github.com/cloudinary/account-provisioning-mcp/releases/download/v0.1.2/mcp-server.mcpb) file onto Claude Desktop to install the extension.

The MCP bundle package includes the MCP server and all necessary configuration. Once installed, the server will be available without additional setup.

> [!NOTE]
> MCP bundles provide a streamlined way to package and distribute MCP servers. Learn more about [Desktop Extensions](https://www.anthropic.com/engineering/desktop-extensions).

</details>

<details>
<summary>Cursor</summary>

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=CldProvisioning&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyJAY2xvdWRpbmFyeS9hY2NvdW50LXByb3Zpc2lvbmluZy1tY3AiLCJzdGFydCIsIi0tcHJvdmlzaW9uaW5nLWFwaS1rZXkiLCIiLCItLXByb3Zpc2lvbmluZy1hcGktc2VjcmV0IiwiIiwiLS1hY2NvdW50LWlkIiwiIl19)

Or manually:

1. Open Cursor Settings
2. Select Tools and Integrations
3. Select New MCP Server
4. If the configuration file is empty paste the following JSON into the MCP Server Configuration:

```json
{
  "command": "npx",
  "args": [
    "@cloudinary/account-provisioning-mcp",
    "start",
    "--provisioning-api-key",
    "",
    "--provisioning-api-secret",
    "",
    "--account-id",
    ""
  ]
}
```

</details>

<details>
<summary>Claude Code CLI</summary>

```bash
claude mcp add CldProvisioning -- npx -y @cloudinary/account-provisioning-mcp start --provisioning-api-key  --provisioning-api-secret  --account-id 
```

</details>
<details>
<summary>Gemini</summary>

```bash
gemini mcp add CldProvisioning -- npx -y @cloudinary/account-provisioning-mcp start --provisioning-api-key  --provisioning-api-secret  --account-id 
```

</details>
<details>
<summary>Windsurf</summary>

Refer to [Official Windsurf documentation](https://docs.windsurf.com/windsurf/cascade/mcp#adding-a-new-mcp-plugin) for latest information

1. Open Windsurf Settings
2. Select Cascade on left side menu
3. Click on `Manage MCPs`. (To Manage MCPs you should be signed in with a Windsurf Account)
4. Click on `View raw config` to open up the mcp configuration file.
5. If the configuration file is empty paste the full json

```bash
{
  "command": "npx",
  "args": [
    "@cloudinary/account-provisioning-mcp",
    "start",
    "--provisioning-api-key",
    "",
    "--provisioning-api-secret",
    "",
    "--account-id",
    ""
  ]
}
```
</details>
<details>
<summary>VS Code</summary>

[![Install in VS Code](https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20CldProvisioning%20MCP&color=0098FF)](vscode://ms-vscode.vscode-mcp/install?name=CldProvisioning&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyJAY2xvdWRpbmFyeS9hY2NvdW50LXByb3Zpc2lvbmluZy1tY3AiLCJzdGFydCIsIi0tcHJvdmlzaW9uaW5nLWFwaS1rZXkiLCIiLCItLXByb3Zpc2lvbmluZy1hcGktc2VjcmV0IiwiIiwiLS1hY2NvdW50LWlkIiwiIl19)

Or manually:

Refer to [Official VS Code documentation](https://code.visualstudio.com/api/extension-guides/ai/mcp) for latest information

1. Open [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)
1. Search and open `MCP: Open User Configuration`. This should open mcp.json file
2. If the configuration file is empty paste the full json

```bash
{
  "command": "npx",
  "args": [
    "@cloudinary/account-provisioning-mcp",
    "start",
    "--provisioning-api-key",
    "",
    "--provisioning-api-secret",
    "",
    "--account-id",
    ""
  ]
}
```

</details>
<details>
<summary> Stdio installation via npm </summary>
To start the MCP server, run:

```bash
npx @cloudinary/account-provisioning-mcp start --provisioning-api-key  --provisioning-api-secret  --account-id 
```

For a full list of server arguments, run:

```
npx @cloudinary/account-provisioning-mcp --help
```

</details>
<!-- End Installation [installation] -->

## Configuration

### Environment Variables

The MCP server supports the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDINARY_ACCOUNT_ID` | Your Cloudinary Account ID | Yes |
| `CLOUDINARY_PROVISIONING_API_KEY` | Your Cloudinary Provisioning API key | Yes |
| `CLOUDINARY_PROVISIONING_API_SECRET` | Your Cloudinary Provisioning API secret | Yes |
| `CLOUDINARY_ACCOUNT_URL` | Complete Account URL (alternative to individual vars) | No |

### CLOUDINARY_ACCOUNT_URL Format

You can use a single `CLOUDINARY_ACCOUNT_URL` instead of individual variables:

```bash
CLOUDINARY_ACCOUNT_URL=account://PROVISIONING_API_KEY:PROVISIONING_API_SECRET@ACCOUNT_ID
```

These credentials are located in the [Cloudinary Console](https://console.cloudinary.com/pm) under **Settings > Account API Keys**.

<!-- Start Authentication [security] -->

## Authentication

The MCP server uses your Cloudinary Account API key and secret for authentication:

```json
{
  "env": {
    "CLOUDINARY_ACCOUNT_ID": "abc123def456",
    "CLOUDINARY_PROVISIONING_API_KEY": "123456789012345",
    "CLOUDINARY_PROVISIONING_API_SECRET": "abcdefghijklmnopqrstuvwxyz12"
  }
}
```

Or use the combined URL format:

```json
{
  "env": {
    "CLOUDINARY_ACCOUNT_URL": "account://123456789012345:abcdefghijklmnopqrstuvwxyz12@abc123def456"
  }
}
```

<!-- End Authentication [security] -->

## Available Tools

The MCP server exposes Cloudinary's Account Provisioning and Permissions APIs as 47 tools. Use your AI application to discover and invoke the available tools.

### Provisioning Tools

- **Product Environments** — List, create, get, update, and delete product environments
- **Users** — List, create, get, update, and delete users; get user groups and sub-accounts
- **User Groups** — List, create, get, update, and delete groups; add/remove users
- **Access Keys** — List, generate, update, and delete access keys (by key or by name)
- **Billing** — Get billing usage information

### Permissions Tools

- **Roles** — List, create, get, update, and delete roles; manage role-principal assignments
- **Policies** — List system/custom/effective policies; create, get, update, and delete custom policies; validate Cedar policies
- **Principals** — List principal roles; assign/remove roles; inspect principals and their permissions
- **Schema & Catalog** — Get Cedar schema; get system roles and policies catalog

### Usage Examples

#### Example 1: Manage Product Environments

```yaml
1. List environments: "Show me all product environments in my account"
2. Get details: "Get details for the 'production' product environment"
3. Create new: "Create a new product environment called 'staging'"
```

#### Example 2: User Management

```yaml
1. List users: "Show all users in my Cloudinary account"
2. Create user: "Add a new admin user with email user@example.com"
3. Assign role: "Give the new user the Admin role on the production environment"
```

#### Example 3: Audit Permissions

```yaml
1. Inspect access: "Who has access to the production product environment?"
2. List roles: "Show me all available global roles"
3. Check user roles: "What roles does user@example.com have?"
```

#### Example 4: Access Key Rotation

```yaml
1. List keys: "Show all access keys for the production environment"
2. Generate: "Generate a new access key called 'ci-deploy'"
3. Disable old: "Disable the old 'ci-deploy-v1' access key"
4. Delete: "Delete the disabled 'ci-deploy-v1' key"
```

<!-- Start Progressive Discovery [dynamic-mode] -->
## Progressive Discovery

MCP servers with many tools can bloat LLM context windows, leading to increased token usage and tool confusion. Dynamic mode solves this by exposing only a small set of meta-tools that let agents progressively discover and invoke tools on demand.

To enable dynamic mode, pass the `--mode dynamic` flag when starting your server:

```jsonc
{
  "mcpServers": {
    "CldProvisioning": {
      "command": "npx",
      "args": ["@cloudinary/account-provisioning-mcp", "start", "--mode", "dynamic"],
      // ... other server arguments
    }
  }
}
```

In dynamic mode, the server registers only the following meta-tools instead of every individual tool:

- **`list_tools`**: Lists all available tools with their names and descriptions.
- **`describe_tool_input`**: Returns the input schema for one or more tools by name.
- **`execute_tool`**: Executes a tool by name with its arguments.
- **`list_scopes`**: Lists the scopes available on the server.

This approach significantly reduces the number of tokens sent to the LLM on each request, which is especially useful for servers with a large number of tools.

You can combine dynamic mode with scope and tool filters:

```jsonc
{
  "mcpServers": {
    "CldProvisioning": {
      "command": "npx",
      "args": ["@cloudinary/account-provisioning-mcp", "start", "--mode", "dynamic", "--scope", "admin"],
      // ... other server arguments
    }
  }
}
```
<!-- End Progressive Discovery [dynamic-mode] -->

# Development

## Building from Source

### Prerequisites

- Node.js v20 or higher
- npm, pnpm, bun, or yarn

### Build Steps

```bash
# Clone the repository
git clone https://github.com/cloudinary/account-provisioning-mcp.git
cd account-provisioning-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Run locally
node ./bin/mcp-server.js start --provisioning-api-key <KEY> --provisioning-api-secret <SECRET> --account-id <ID>
```

Or debug with the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node ./bin/mcp-server.js start --provisioning-api-key <KEY> --provisioning-api-secret <SECRET> --account-id <ID>
```

### Project Structure

```ini
account-provisioning-mcp/
├── src/
│   ├── hooks/              # SDK hooks (manual)
│   │   ├── accountConfig.ts         # CLOUDINARY_ACCOUNT_URL parsing
│   │   ├── cloudinaryAccountHook.ts # Auth injection (Basic auth)
│   │   ├── userAgentHook.ts         # Build User-Agent string
│   │   └── registration.ts          # Hook registration
│   ├── mcp-server/         # MCP server implementation
│   │   ├── server.ts             # Main server (auto-generated)
│   │   └── tools/                # Generated tool wrappers
│   ├── funcs/              # API function implementations
│   └── models/             # Type definitions
├── .github/
│   └── workflows/          # CI/CD workflows
└── .speakeasy/             # Speakeasy configuration
```

## Publishing to Anthropic MCP Registry

This server generates a `server.json` that conforms to the [official MCP Registry schema](https://modelcontextprotocol.io/registry/about). You can publish automatically via your Speakeasy workflow or manually using the `mcp-publisher` CLI.

### Automated Publishing (Recommended)

Add `mcpRegistry` to the `publish` block in your `workflow.yaml`:

```yaml
targets:
  my-mcp:
    target: mcp-typescript
    source: my-source
    publish:
      npm:
        token: $NPM_TOKEN
      mcpRegistry:
        auth: github-oidc
```

### Manual Publishing

Follow the [official publishing guide](https://github.com/modelcontextprotocol/registry/blob/main/docs/guides/publishing/publish-server.md):

1. **Publish to npm**: `npm publish --access public`
2. **Install the publisher CLI**:
   ```bash
   curl -sL "https://github.com/modelcontextprotocol/registry/releases/latest/download/mcp-publisher_$(uname -s | tr '[:upper:]' '[:lower:]')_$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/').tar.gz" | tar xz mcp-publisher && sudo mv mcp-publisher /usr/local/bin/
   ```
3. **Authenticate**: `mcp-publisher login github`
4. **Publish**: `mcp-publisher publish`

## Contributions

While we value contributions to this MCP Server, most of the code is generated programmatically from the Cloudinary API spec. Any manual changes to generated files will be overwritten on the next generation — please direct your changes to the manual extension points below.

**What you can contribute:**

- SDK hooks in `src/hooks/` (auth, user agent)
- Documentation improvements (this README, JSDoc on manual files)
- Bug reports and feature requests

**Generated files (do not edit):**

- `src/mcp-server/server.ts`
- `src/mcp-server/tools/*.ts`
- `src/funcs/*.ts`
- `src/models/*.ts`

When touching generated files is unavoidable, prefer updating the upstream spec or Speakeasy configuration in `.speakeasy/` so the change survives regeneration.

We look forward to hearing your feedback. Feel free to open a PR or issue with a proof of concept and we'll do our best to include it in a future release.

---

### MCP Server Created by [Speakeasy](https://www.speakeasy.com/?utm_source=account-provisioning-mcp&utm_campaign=mcp-typescript)

<!-- Placeholder for Future Speakeasy SDK Sections -->
