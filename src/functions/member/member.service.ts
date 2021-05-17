import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { DynamoActions } from "../../utils/dynamodb"
import { Logger } from "../../utils/logger"

const databaseService: DocumentClient = new DocumentClient()
const DB_NAME_MEMBER_ITEM = 'mia-backend-member-email'

export interface MemberItem {
    email: string
    isHelloAsso: boolean
    hasPaid: boolean
    dateOfBirth: string
    firstName: string
    lastName: string
    phoneNumber: string
    address: string
    postalCode: string
    city: string
    practice: string
    helloAssoData: string
    creationDate: string
}

export class MemberService {
  public static async addMember(member: MemberItem) {
    member.creationDate = Date.now().toString()
    Logger.logInfo('MemberService', 'Add member : ' + JSON.stringify(member))
    await DynamoActions.put({
        TableName: DB_NAME_MEMBER_ITEM,
        Item: member
    }, databaseService)
  }

  public static async updatePaid(memberId) {
    const member = await this.getMemberByEmail(memberId)
    if (!member.isHelloAsso) {
      member.hasPaid = !member.hasPaid
      Logger.logInfo('MemberService', 'Update paid status dor member : ' + JSON.stringify(member))
      await DynamoActions.put({
          TableName: DB_NAME_MEMBER_ITEM,
          Item: member
      }, databaseService)
    }
  }

  public static async getMemberByEmail(memberEmail: string): Promise<MemberItem> {
    return await DynamoActions.get({
      TableName: DB_NAME_MEMBER_ITEM,
      Key: { email: memberEmail }
    }, databaseService) as MemberItem
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