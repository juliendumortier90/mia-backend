import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getFormatedTodayDateSlash } from '../../../utils/date'
import { Response } from '../../../utils/reponse'
import { MemberService } from '../member.service'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const item = JSON.parse(event['body'])
    if (item.eventType === 'Order') {
      console.log("new hello asso member: " + JSON.stringify(item))
      const member = {
        isHelloAsso: true,
        hasPaid: true,
        email: item.data?.items[0]?.customFields?.find(field => field.name === 'Email').answer,
        dateOfBirth: item.data?.items[0]?.customFields?.find(field => field.name === 'Date de naissance').answer,
        firstName: item.data?.items[0]?.user?.firstName,
        lastName: item.data?.items[0]?.user?.lastName,
        phoneNumber: item.data?.items[0]?.customFields?.find(field => field.name === 'Numéro de téléphone').answer,
        address: item.data?.items[0]?.customFields?.find(field => field.name === 'Adresse').answer,
        postalCode: item.data?.items[0]?.customFields?.find(field => field.name === 'Code Postal').answer,
        city: item.data?.items[0]?.customFields?.find(field => field.name === 'Ville').answer,
        practice: item.data?.items[0]?.customFields?.find(field => field.name === 'Pratique sportive').answer,
        commentaire: item.data?.items[0]?.customFields?.find(field => field.name === 'Commentaire').answer,
        helloAssoData: item,
        creationDate: getFormatedTodayDateSlash()
      }
      await MemberService.addMember(member)
    }
    return Response.makeSuccessResponse()
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}