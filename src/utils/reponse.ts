import { APIGatewayProxyResult } from "aws-lambda"

export class Response {
    public static async makeSuccessResponse(data: any): Promise<APIGatewayProxyResult> {
        return {
          statusCode: 200,
          body: JSON.stringify(data)
        }
    }

    public static async makeErrorResponse(data: any): Promise<APIGatewayProxyResult> {
       return {
          statusCode: 500,
          body: JSON.stringify(data)
        }
      }
}