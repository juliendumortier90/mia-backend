import { APIGatewayRequestAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import { Logger } from '../../utils/logger'
import { AuthorizerPolicyBuilder } from './policy'
import { ApiKeyService } from './service'

const apiKeyService: ApiKeyService = new ApiKeyService()

exports.validation = async (event: APIGatewayRequestAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  Logger.logInfo('authorizer', 'Checking if user is authorized ' + JSON.stringify(event.headers))
  const policy = new AuthorizerPolicyBuilder(event.methodArn)
  const apiKey = event.headers?.['x-api-key']?.toString() || ''

  if (apiKey.length < 15) {
    Logger.logError('authorizer', 'Missing apikey', 'Missing apikey in header')
    return policy.deny().build()
  }

  const ipAddress = event.requestContext?.identity?.sourceIp.toString() ?? ''
  const followingRole = event.resource?.toString() ?? ''

  // enabled by env var AUTH_ACTIVATION
    try {
      const roles = await apiKeyService.getRolesByApiKey(apiKey)
      if (roles.includes(followingRole)) {
        Logger.logInfo('authorizer',
          `User is authorized to access ${followingRole} with ip ${ipAddress}`
        )
        // allow specific ressource by role
        return policy.allow('*').build()
      }
    } catch (error) {
      Logger.logError('authorizer', `Error when try to validate access: ${error}`, `Error when try to validate access: ${error}`)
    }
  Logger.logError('authorizer',
    `User with Api Key ${apiKey} not authorized to access ${followingRole} with ip ${ipAddress}`,
    `User with Api Key ${apiKey} not authorized to access ${followingRole} with ip ${ipAddress}`
  )
  return policy.deny().build()
}
