import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { MemberService } from '../../member/member.service'
import { Response } from '../../../utils/reponse'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const member = JSON.parse(event['body'])
    return Response.makeSuccessResponse(await MemberService.updatePaid(member.email))
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}