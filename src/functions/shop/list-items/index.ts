import { APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'
import { MemberService } from '../../member/member.service'

export const handler = async (): Promise<APIGatewayProxyResult> =>   {
  try {
    return Response.makeSuccessResponse(await MemberService.listMembers())
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}