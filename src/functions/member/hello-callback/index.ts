import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const item = JSON.parse(event['body'])
    console.log("hello : " + JSON.stringify(item))
    return Response.makeSuccessResponse()
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}