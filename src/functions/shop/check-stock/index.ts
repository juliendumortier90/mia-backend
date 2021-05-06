import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const articles = JSON.parse(event['body'])
    console.log(articles)
    // check number of items in stock
    return Response.makeSuccessResponse({ stock: 'ok'})
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}