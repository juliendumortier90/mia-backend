import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ApiError } from '../../utils/apiError';
import { DynamoActions } from '../../utils/dynamodb'

const DB_NAME_USER_TOKEN = 'mia-backend-admin-token'

const databaseService: DocumentClient = new DocumentClient()

export class ApiKeyService {

  public async getRolesByApiKey(token: string): Promise<any> {
    try {
      let params = {
        TableName : DB_NAME_USER_TOKEN,
        FilterExpression: "contains(#token, :token)",
        ExpressionAttributeNames: {
            "#token": "token",
        },
        ExpressionAttributeValues: {
            ":token": token,
        }       
      };
      const items = await DynamoActions.scan(params, databaseService)
      if (items.length == 0) {
          throw new ApiError('Authorizer', 'token not found: ' + token, 'token not found: ' + token)
      }
      const first = items[0]
      const roles = JSON.parse(JSON.stringify(first.roles)) // magic parse to array
      return roles
    } catch (error) {
      throw new ApiError('Authorizer', 'token not found: ' + token, 'token not found: ' + token)
    }
  }
}
