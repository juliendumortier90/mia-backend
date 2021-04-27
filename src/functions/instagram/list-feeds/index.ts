import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

import { InstagramService } from './service'

export const handler = (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> =>
  InstagramService.listFeeds()