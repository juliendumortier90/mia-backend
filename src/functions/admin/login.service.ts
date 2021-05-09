import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone'
import { ApiError } from '../../utils/apiError';
import { DynamoActions } from '../../utils/dynamodb';
import { Logger } from '../../utils/logger';
import { TokenGenerator } from 'ts-token-generator';

dayjs.extend(timezone)

const databaseService: DocumentClient = new DocumentClient()
const DB_NAME_USER = 'mia-backend-user'
const DB_NAME_USER_TOKEN = 'mia-backend-user-token'


export interface User {
    login: string
    passwordMd5: string
    password: string
    creationDate: string
}

export class LoginService {

    public static async addUser(user: User) {
        let params = {
            TableName : DB_NAME_USER,
            FilterExpression: "contains(#login, :login)",
            ExpressionAttributeNames: {
                "#login": "login",
            },
            ExpressionAttributeValues: {
                ":login": user.login,
            }       
        };
        const items = (await DynamoActions.scan(params, databaseService)) as unknown as User[]
        if (items.length > 0) {
            throw new ApiError('LoginService', 'user already exist: ' + user.login, user.login, 410)
        }

        await DynamoActions.put({
            TableName: DB_NAME_USER,
            Item: user
          }, databaseService)
        Logger.logInfo('LoginService', 'Add user : '+JSON.stringify(user))
    }

    public static async getUserByLogin(login: any): Promise<User> {
        Logger.logInfo('LoginService', 'getUserByLogin : ' + login)
        return await DynamoActions.get({
          TableName: DB_NAME_USER,
          Key: { login: login }
        }, databaseService) as User
    }

    public static async generateTokenForUser(user): Promise<any> {
        // generate token
        const tokgen = new TokenGenerator(); // Default is a 128-bit token encoded in base58
        const token = tokgen.generate();

        Logger.logInfo('LoginService', 'generate token for user : ' + JSON.stringify(user) + ' ; token: ' + token)
        const userToken = {
            user,
            token,
            expiredAt: this.timestampNowPlus(2, 'days'),
        }

        // remove old from db
        await DynamoActions.delete({
            TableName: DB_NAME_USER_TOKEN,
            Key: { token }
        }, databaseService)
        
        // put in db
        await DynamoActions.put({ TableName: DB_NAME_USER_TOKEN, Item: userToken }, databaseService)
    }

    public static getNow(): string {
        return dayjs().valueOf().toString()
    }

    private static getFormatedTodayDate(): string {
        return dayjs().tz('Europe/Paris').format('YYYY-MM-DD')
    }

    private static timestampNowPlus(number: number, type: dayjs.OpUnitType): number {
        return dayjs(this.getFormatedTodayDate()).add(number, type).unix()
    }
}