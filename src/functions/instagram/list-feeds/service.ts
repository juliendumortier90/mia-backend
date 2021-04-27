import { APIGatewayProxyResult } from "aws-lambda"

export class InstagramService {
  public static async listFeeds(): Promise<any> {
    return this.makeValidResponse('toto reponse')
  }

  public static makeValidResponse(data: any): APIGatewayProxyResult {
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    }
  }
}

