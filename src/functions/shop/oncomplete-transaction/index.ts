import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const paypalData = JSON.parse(event['body'])
    console.log(JSON.stringify(paypalData))
    return Response.makeSuccessResponse()
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}