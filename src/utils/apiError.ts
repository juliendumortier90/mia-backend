import { Logger } from './logger'

export class ApiError {
    constructor(public readonly serviceName: string, public readonly message: string, public readonly error: any) {
        Logger.logError(serviceName, message, error)
    }
}