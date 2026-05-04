import { AccountConfig } from "./accountConfig.js";
import { BeforeRequestContext, BeforeRequestHook, SDKInitHook } from "./types.js";
import { SDKOptions } from "../lib/config.js";
import { stringToBase64 } from "../lib/base64.js";

/**
 * Populates account_id from CLOUDINARY_ACCOUNT_URL on init, and
 * attaches Basic auth (provisioning_api_key:provisioning_api_secret) to every request.
 *
 * Credential resolution order:
 *   1. Explicit security passed to the SDK constructor
 *   2. CLOUDINARY_ACCOUNT_URL / individual CLOUDINARY_ACCOUNT_* env vars
 */
export class CloudinaryAccountHook implements SDKInitHook, BeforeRequestHook {
    private readonly config: AccountConfig;

    constructor(config: AccountConfig) {
        this.config = config;
    }

    sdkInit(opts: SDKOptions): SDKOptions {
        if (!opts.account_id && this.config.accountId) {
            opts.account_id = this.config.accountId;
        }
        return opts;
    }

    async beforeRequest(
        hookCtx: BeforeRequestContext,
        request: Request,
    ): Promise<Request> {
        const security = await this.resolveSecurity(hookCtx.securitySource);
        const { key, secret } = this.resolveCredentials(security);

        if (!key || !secret) {
            throw new Error("Provisioning API key and secret are required");
        }

        const encoded = stringToBase64(`${key}:${secret}`);
        request.headers.set("Authorization", `Basic ${encoded}`);

        return request;
    }

    private async resolveSecurity(source: unknown): Promise<unknown> {
        return typeof source === "function" ? source() : source;
    }

    private resolveCredentials(security: unknown): { key: string; secret: string } {
        let key = this.config.provisioningApiKey;
        let secret = this.config.provisioningApiSecret;

        if (!security || typeof security !== "object") {
            return { key, secret };
        }

        const sec = security as Record<string, any>;

        // Nested cloudinaryAccountAuth format
        if (sec["cloudinaryAccountAuth"]) {
            const auth = sec["cloudinaryAccountAuth"];
            key = auth.provisioningApiKey || auth.provisioning_api_key || key;
            secret = auth.provisioningApiSecret || auth.provisioning_api_secret || secret;
        }
        // Flat security format (camelCase)
        else if ("provisioningApiKey" in sec || "provisioningApiSecret" in sec) {
            key = sec["provisioningApiKey"] || key;
            secret = sec["provisioningApiSecret"] || secret;
        }
        // Flat security format (snake_case)
        else if ("provisioning_api_key" in sec || "provisioning_api_secret" in sec) {
            key = sec["provisioning_api_key"] || key;
            secret = sec["provisioning_api_secret"] || secret;
        }

        return { key, secret };
    }
}
