export class Logger {
    public static logInfo(serviceName: string, message: string) {
        console.log(`[INFO][${serviceName}] ${message}`)
    }

    public static logError(serviceName: string, message: string, error: any) {
        console.log(`[ERROR][${serviceName}] ${message} | `+JSON.stringify(error))
    }
}