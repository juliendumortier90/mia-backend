import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { Response } from '../../../utils/reponse'
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'
import { LoginService } from '../login.service';
import { ApiError } from '../../../utils/apiError';
import { Logger } from '../../../utils/logger';

dayjs.extend(timezone)

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> =>   {
  try {
    const body = JSON.parse(event['body'])
    Logger.logInfo('LoginService', 'try to connect with ' + JSON.stringify(body))
    // get login and password
    const login = body.login
    const passwordMd5 = body.password

    // get in bdd by login
    const user = await LoginService.getUserByLogin(login)

    // compare md5
    if (user.passwordMd5 != passwordMd5) {
        throw new ApiError('API Error', 'erreur de connexion, mauvais mot de passe', passwordMd5)
    }

    // make token
    if (!user.isActivate) {
      throw new ApiError('Login', 'user is not activated', 'user is not activated', 433)
    }
    const userToken = await LoginService.generateTokenForUser(user)
    return Response.makeSuccessResponse({ token : userToken })
  } catch (error) {
    return Response.makeErrorResponse(error)
  }
}

