import { Logger } from '../../../utils/logger';

const paypal = require('@paypal/checkout-server-sdk')

export class PaypalService {

    public static async getOrderById(orderId: string) {
        let request = new paypal.orders.OrdersGetRequest(orderId)
        const response = await PaypalService.client().execute(request)
        Logger.logInfo('GetOrderById', JSON.stringify(response))
        return response
    }

    private static environment() {
        let clientId = 'ARkJXyaiP9QAJpk2A235mcCBPPv5z2TzeGzX2C26oGgqsSPA-RuHxPU73cwyQolaDnOzZCUYompaIfmz';
        let clientSecret = 'EGSN-3XZANjg567HDD58wBHF9UrMcuEjWuDp1mYQYT4b6hyD3Azk7MJ04SLbvCBZXmu9Sk42Ym5hZfBN';
    
        return new paypal.core.SandboxEnvironment(
            clientId, clientSecret
        )
    }

    private static client() {
        return new paypal.core.PayPalHttpClient(PaypalService.environment())
    }
}