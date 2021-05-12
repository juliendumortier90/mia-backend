import { APIGatewayProxyResult } from 'aws-lambda'
import { MemberService } from '../../member/member.service'
import { Response } from '../../../utils/reponse'

export const handler = async (): Promise<APIGatewayProxyResult> =>   {
  try {
    return Response.makeSuccessResponse(await MemberService.listMembers())
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}