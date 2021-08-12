import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getFormatedTodayDateSlash } from '../../../utils/date'
import { Response } from '../../../utils/reponse'
import { MemberService } from '../member.service'

/*
2021-08-11T01:06:10.860Z	fb02d9d0-79e9-43b9-ac72-1ede08400344	INFO	new hello asso member: {
    "data": {
        "payer": {
            "dateOfBirth": "1972-06-29T00:00:00+02:00",
            "email": "shogun.bmx@gmail.com",
            "address": "",
            "city": "",
            "zipCode": "",
            "country": "FRA",
            "company": "",
            "firstName": "Stephane",
            "lastName": "Meneau"
        },
        "amount": {
            "total": 2000,
            "vat": 0,
            "discount": 0
        },
        "id": 25319342,
        "date": "2021-08-09T21:47:45.3661119+00:00",
        "formSlug": "adhesion-a-l-association-made-in-apremont-mia",
        "formType": "Membership",
        "organizationSlug": "madeinapremont"
    },
    "eventType": "Order"
}
*/

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const item = JSON.parse(event['body'])
    if (item.eventType === 'Order') {
      console.log("new hello asso member: " + JSON.stringify(item))
      const member = {
        isHelloAsso: true,
        hasPaid: true,
        email: item.data?.items[0]?.customFields?.find(field => field.name === 'Email')?.answer,
        dateOfBirth: item.data?.items[0]?.customFields?.find(field => field.name === 'Date de naissance')?.answer,
        firstName: item.data?.items[0]?.user?.firstName,
        lastName: item.data?.items[0]?.user?.lastName,
        phoneNumber: item.data?.items[0]?.customFields?.find(field => field.name === 'Numéro de téléphone')?.answer,
        address: item.data?.items[0]?.customFields?.find(field => field.name === 'Adresse')?.answer,
        postalCode: item.data?.items[0]?.customFields?.find(field => field.name === 'Code Postal')?.answer,
        city: item.data?.items[0]?.customFields?.find(field => field.name === 'Ville')?.answer,
        practice: item.data?.items[0]?.customFields?.find(field => field.name === 'Pratique sportive')?.answer,
        commentaire: item.data?.items[0]?.customFields?.find(field => field.name === 'Commentaire')?.answer,
        helloAssoData: item,
        creationDate: getFormatedTodayDateSlash()
      }
      console.log("member to add: " + JSON.stringify(member))
      await MemberService.addMember(member)
    }
    return Response.makeSuccessResponse()
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}