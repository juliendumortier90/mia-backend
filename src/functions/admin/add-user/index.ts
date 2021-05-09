import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'
import { LoginService } from '../login.service';
import { ApiError } from '../../../utils/apiError';
import { User } from '../login.service';
import { timestampNowPlus } from '../../../utils/date';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const body = JSON.parse(event['body'])
    // get login and password
    const userToAdd = body.user as User
    
    if (userToAdd.login == null ||  userToAdd.login.length < 4 || userToAdd.passwordMd5 == null || userToAdd.passwordMd5.length < 5) {
      throw new ApiError('Add User Error', 'les paramètres du user ne sont pas tous corrects', userToAdd)
    }

    userToAdd.creationDate = timestampNowPlus(1, 'seconds').toString()

    // get in bdd by login
    const user = await LoginService.addUser(userToAdd)

    const userToken = await LoginService.generateTokenForUser(user)

    return Response.makeSuccessResponse(userToken.token)
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}

