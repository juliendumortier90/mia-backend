import { APIGatewayAuthorizerResult, Statement } from 'aws-lambda'

// eslint-disable-next-line no-shadow
export enum AWSEffect {
  UnAuthorized = 'Deny',
  Authorized = 'Allow'
}

export class AuthorizerPolicyBuilder {
  awsAccountId: string
  region: string
  restApiId: string
  stage: string
  method: string
  resource: string
  baseArn: string
  allowedMethods: Statement[] = []
  deniedMethods: Statement[] = []
  principalId: string

  /**
   * Create the policy builder from the method arn
   * @param methodArn the arn of the method requested by the user
   * @param user the id of the user who will have the policy
   */
  constructor(methodArn: string, user = '*') {
    this.baseArn = methodArn
    this.principalId = user
    const awsArnTmp = methodArn.split(':')
    let path
    ;[, , , this.region, this.awsAccountId, path] = awsArnTmp
    let resource
    ;[this.restApiId, this.stage, this.method, ...resource] = path.split('/')
    this.resource += resource.join('/')
  }

  /**
   *
   * Allow access to the current method or a specific method on the gateway
   * You can use wildcards
   * @param absolutePath the method to allow. If empty the current method
   */
  allow(absolutePath?: string): AuthorizerPolicyBuilder {
    this.allowedMethods.push(this.buildStatement(AWSEffect.Authorized, absolutePath))
    return this
  }

  /**
   *
   * Deny access to the current method or a specific method on the gateway
   * You can use wildcards
   * @param absolutePath the method to allow. If empty the current method
   */
  deny(absolutePath?: string): AuthorizerPolicyBuilder {
    this.deniedMethods.push(this.buildStatement(AWSEffect.UnAuthorized, absolutePath))
    return this
  }

  /**
   * Build unitary policy
   * @param authorization Allow/Deny
   * @param absolutePath Path of the method (take the current method if empty). You can use wildcards.
   * @param verb GET/POST/... All verbs by default
   */
  private readonly buildStatement = (authorization: AWSEffect, absolutePath?: string, verb = '*') => ({
    Action: 'execute-api:Invoke',
    Effect: authorization,
    Resource: absolutePath
      ? `arn:aws:execute-api:${this.region}:${this.awsAccountId}:${this.restApiId}/${this.stage}/${verb}${absolutePath}`
      : this.baseArn
  })

  /**
   * Build the policy
   */
  build(): APIGatewayAuthorizerResult {
    return {
      principalId: this.principalId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: this.allowedMethods.concat(this.deniedMethods)
      }
    }
  }
}
