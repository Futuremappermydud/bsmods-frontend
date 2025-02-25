import type { APIStatus } from "$lib/types/APIStatus";
import axios from "axios";
import { appendURL } from "./url";
import { env } from "$env/dynamic/public";

async function getBackendStatus() {
    return await axios.get(appendURL(`/api/bbmStatusForBbmAlsoPinkEraAndLillieAreCuteBtwWilliamGay
`)).then((res) => {
        return {
            data: res.data as APIStatus,
            status: res.status
        }
    }).catch((err) => {
        return {
            data: {
                message: "Backend is down",
                veryImportantMessage: "Backend is down",
                apiVersion: "Backend is down",
                gitVersion: "Backend is down",
                isDocker: false
            },
            status: err.response.status ? err.response.status : 0
        }
    });
}

function getFrontendStatus() {
    let gitVersion = undefined
    
    if (env.PUBLIC_GIT_VERSION === undefined) {
        gitVersion = "Unknown"
    } else {
        gitVersion = env.PUBLIC_GIT_VERSION
    }

    return {
        message: "Frontend is working",
        gitVersion: gitVersion
    }
}

export async function getStatus() {
    let backendStatus = await getBackendStatus()
    let frontendStatus = getFrontendStatus()
    return {
        httpCode: backendStatus.status as number,
        backend: backendStatus.data,
        frontend: frontendStatus
    }
}

export type ServerStatus = {
    httpCode: number,
    backend: APIStatus,
    frontend: {
        message: string,
        gitVersion: string
    }
}