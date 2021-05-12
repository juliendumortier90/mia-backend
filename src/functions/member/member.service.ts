import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { DynamoActions } from "../../utils/dynamodb"
import { Logger } from "../../utils/logger"

const databaseService: DocumentClient = new DocumentClient()
const DB_NAME_MEMBER_ITEM = 'mia-backend-member-item'

export interface MemberItem {
    id?: string
    isHelloAsso: boolean
    hasPaid: boolean
    email: string
    dateOfBirth: string
    firstName: string
    lastName: string
    phoneNumber: string
    address: string
    postalCode: string
    city: string
    practice: string
    helloAssoData: string
}

export class MemberService {
  public static async addMember(member: MemberItem) {
    const id = Math.random().toString(36).substr(2, 20)
    member.id = id
    Logger.logInfo('MemberService', 'Add member : ' + JSON.stringify(member))
    await DynamoActions.put({
        TableName: DB_NAME_MEMBER_ITEM,
        Item: member
    }, databaseService)
  }

  public static async listMembers(): Promise<MemberItem[]> {
    const members = ((await DynamoActions.scan({
        TableName : DB_NAME_MEMBER_ITEM
      }
    , databaseService)) as unknown as MemberItem[])
    return members.map(member => {
        member.helloAssoData = "";
        return member;
    })
  }
}