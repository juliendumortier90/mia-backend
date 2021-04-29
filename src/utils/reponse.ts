import { APIGatewayProxyResult } from "aws-lambda"
import { ApiError } from "./apiError"

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
        const body = data instanceof ApiError ? JSON.stringify(data.error) : JSON.stringify(data)
        return {
          statusCode: 400,
          body
        }
    }
}