import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'
import { InstagramAuthenticationService } from './service'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
    try {
        const code = event.queryStringParameters.code
        await InstagramAuthenticationService.onReceiveCode(code)
        return Response.makeSuccessResponse()
    } catch(error) {
        return Response.makeErrorResponse(error)
    }
}