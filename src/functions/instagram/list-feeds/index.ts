import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'
import { Response } from '../../../utils/reponse'

import { InstagramService } from './service'

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>   {
  try {
    return Response.makeSuccessResponse(await InstagramService.listFeeds())
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}