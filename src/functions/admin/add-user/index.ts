import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'
import { LoginService } from '../login.service';
import { ApiError } from '../../../utils/apiError';
import { User } from '../login.service';

dayjs.extend(timezone)

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const body = JSON.parse(event['body'])
    // get login and password
    const userToAdd = body.user as User
    
    if (userToAdd.login == null ||  userToAdd.login.length < 4 || userToAdd.passwordMd5 == null || userToAdd.passwordMd5.length < 5) {
      throw new ApiError('Add User Error', 'les paramètres du user ne sont pas tous corrects', userToAdd)
    }

    userToAdd.creationDate = dayjs().valueOf().toString()

    // get in bdd by login
    const user = await LoginService.addUser(userToAdd)

    const userToken = await LoginService.generateTokenForUser(user)
    userToken.user.password = 'anonymised' // anonymise password

    return Response.makeSuccessResponse(userToken)
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}

