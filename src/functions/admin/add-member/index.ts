import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { MemberItem, MemberService } from '../../member/member.service'
import { ApiError } from '../../../utils/apiError'
import { Response } from '../../../utils/reponse'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const member = JSON.parse(event['body'])
    if(!member.email || !member.firstName || !member.lastName || !member.dateOfBirth) {
      throw new ApiError('add member', 'member to add not valid', { message: 'member to add not valid'})
    }
    member.helloAssoData = ''
    member.isHelloAsso = false
    member.creationDate = Date.now().toString()
    await MemberService.addMember(member as MemberItem)
    return Response.makeSuccessResponse()
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}