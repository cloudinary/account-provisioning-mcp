import { SDKInitHook } from "./types.js";
import { SDKOptions, SDK_METADATA } from "../lib/config.js";

function getProductName(packageName: string): string {
    try {
        if (packageName) {
            const match = packageName.match(/@cloudinary\/(.+)/);
            if (match && match[1]) {
                return match[1]
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join("");
            }
        }
        return "Unknown";
    } catch {
        return "Unknown";
    }
}

function getSystemInfo(): string {
    const process = (globalThis as any)?.process;
    const nodeVersion = process?.version || "unknown";
    const platform = process?.platform || "unknown";
    const arch = process?.arch || "unknown";

    return `Node.js ${nodeVersion.startsWith("v") ? nodeVersion.substring(1) : nodeVersion}; ${platform} ${arch}`;
}

function buildUserAgent(
    sdkVersion: string,
    genVersion: string,
    openapiDocVersion: string,
    packageName: string,
): string {
    const productName = getProductName(packageName);
    const systemInfo = getSystemInfo();

    return `Cloudinary/${productName} NodeJS/${sdkVersion} Gen/${genVersion} Schema/${openapiDocVersion} (${systemInfo})`;
}

export class UserAgentHook implements SDKInitHook {
    sdkInit(opts: SDKOptions): SDKOptions {
        const originalUserAgent = SDK_METADATA.userAgent;

        if (originalUserAgent && originalUserAgent.startsWith("speakeasy-sdk/")) {
            const parts = originalUserAgent.split(" ");

            if (parts.length >= 5) {
                const sdkVersion = parts[1];
                const genVersion = parts[2];
                const openapiDocVersion = parts[3];
                const packageName = parts[4];

                if (sdkVersion && genVersion && openapiDocVersion && packageName) {
                    opts.userAgent = buildUserAgent(
                        sdkVersion,
                        genVersion,
                        openapiDocVersion,
                        packageName,
                    );
                }
            }
        }
        return opts;
    }
}
