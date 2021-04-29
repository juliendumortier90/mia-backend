import { APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'

import { InstagramService } from '../service'

export const handler = async (): Promise<APIGatewayProxyResult> =>   {
  try {
    return Response.makeSuccessResponse(await InstagramService.listFeeds())
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}