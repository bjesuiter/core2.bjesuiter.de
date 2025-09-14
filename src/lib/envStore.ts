"use server";
import * as v from "valibot";

const EnvSchema = v.object({
    // Note: deno_deploy now denotes deno deploy EA 
    STAGE: v.optional(v.picklist(["local", "deno_deploy", "undefined"]), "undefined"),
    DENO_DEPLOYMENT_ID: v.optional(v.string()),
    CLOUDFLARE_EMAIL: v.string(),
    CLOUDFLARE_DDNS_API_TOKEN: v.string(),
    CLOUDFLARE_ZONE_ID_HIBISK_DE: v.string(),
    CORE_ROOT_USER_EMAIL: v.pipe(v.string(), v.email()),
    CORE_DDNS_USERNAME: v.string(),
    CORE_DDNS_PASSWORD: v.string(),
    CORE_DATABASE_URL: v.pipe(v.string(), v.url()),
    TURSO_AUTH_TOKEN: v.string(),
})

function initEnvStore(envs: NodeJS.ProcessEnv) {
    // This will throw if the envs are not valid
    const parsedEnv = v.parse(EnvSchema, envs);

    return {
        ...parsedEnv,
        STAGE: parsedEnv.STAGE || "undefined"
    }
}

// the export of my env store
export const envStore = initEnvStore(process.env);

// some shortcuts for common checks
export const isRunningOnDenoDeploy = envStore.STAGE === "deno_deploy";
export const isRunningLocally = envStore.STAGE === "local";