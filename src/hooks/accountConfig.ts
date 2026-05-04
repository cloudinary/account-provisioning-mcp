/**
 * Parsed value for the collect_headers option.
 *   - `true`  → collect ALL response headers
 *   - `string[]` → collect only the listed header names (lowercased)
 *   - `[]`    → disabled (default)
 */
export type CollectHeaders = true | string[];

/**
 * Parses Cloudinary account configuration from CLOUDINARY_ACCOUNT_URL
 * or individual CLOUDINARY_ACCOUNT_* environment variables.
 *
 * URL format: account://<provisioning_api_key>:<provisioning_api_secret>@<account_id>
 */
export class AccountConfig {
    accountId: string;
    provisioningApiKey: string;
    provisioningApiSecret: string;
    collectHeaders: CollectHeaders;

    constructor() {
        this.accountId = "";
        this.provisioningApiKey = "";
        this.provisioningApiSecret = "";
        this.collectHeaders = [];

        const process = (globalThis as any)?.process;
        if (!process?.env) return;

        const accountUrl = process.env.CLOUDINARY_ACCOUNT_URL;
        if (accountUrl) {
            this.loadFromUrl(accountUrl);
        }

        // Individual env vars override URL-parsed values
        if (process.env.CLOUDINARY_ACCOUNT_ID) {
            this.accountId = process.env.CLOUDINARY_ACCOUNT_ID;
        }
        if (process.env.CLOUDINARY_PROVISIONING_API_KEY) {
            this.provisioningApiKey = process.env.CLOUDINARY_PROVISIONING_API_KEY;
        }
        if (process.env.CLOUDINARY_PROVISIONING_API_SECRET) {
            this.provisioningApiSecret = process.env.CLOUDINARY_PROVISIONING_API_SECRET;
        }

        if (process.env.CLOUDINARY_COLLECT_HEADERS) {
            this.collectHeaders = AccountConfig.parseCollectHeaders(
                process.env.CLOUDINARY_COLLECT_HEADERS,
            );
        }
    }

    private loadFromUrl(url: string): void {
        try {
            const parsed = new URL(url);
            if (parsed.protocol !== "account:") {
                throw new Error("Invalid URL scheme. Expecting 'account://'");
            }
            this.accountId = parsed.hostname || "";
            this.provisioningApiKey = decodeURIComponent(parsed.username || "");
            this.provisioningApiSecret = decodeURIComponent(parsed.password || "");

            const collectParam = parsed.searchParams.get("collect_headers");
            if (collectParam) {
                this.collectHeaders = AccountConfig.parseCollectHeaders(collectParam);
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes("Expecting")) {
                throw error;
            }
            throw new Error(`Invalid CLOUDINARY_ACCOUNT_URL: '${url}'`);
        }
    }

    private static parseCollectHeaders(value: string): CollectHeaders {
        const trimmed = value.trim().toLowerCase();
        if (trimmed === "true" || trimmed === "all") {
            return true;
        }
        return trimmed.split(",").map((h) => h.trim()).filter(Boolean);
    }
}
