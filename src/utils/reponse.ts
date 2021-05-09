import { APIGatewayProxyResult } from "aws-lambda"
import { ApiError } from "./apiError"
import { Logger } from "./logger"

export class Response {
    public static async makeSuccessResponse(data: any = {success: true}): Promise<APIGatewayProxyResult> {
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(data)
        }
    }

    public static async makeErrorResponse(data: any | ApiError): Promise<APIGatewayProxyResult> {
        Logger.logError('error', 'erreur in makeErrorResponse', data)
        const body = data instanceof ApiError ? JSON.stringify(data.error) : JSON.stringify(data)
        const responseCode = data instanceof ApiError ? data.status : 400
        return {
          statusCode: responseCode,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body
        }
    }
}