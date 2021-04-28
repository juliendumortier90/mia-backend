import { Logger } from "./logger";

export class ApiError {
    constructor(serviceName: string, message: string, error: any) {
        Logger.logError(serviceName, message, error)
    }
}