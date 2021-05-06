import { ShopItem } from '../service'

const paypal = require('@paypal/checkout-server-sdk')

export class PaypalService {

    private static client() {
        return new paypal.core.PayPalHttpClient(PaypalService.environment())
    }

    private static environment() {
        let clientId = 'ARkJXyaiP9QAJpk2A235mcCBPPv5z2TzeGzX2C26oGgqsSPA-RuHxPU73cwyQolaDnOzZCUYompaIfmz';
        let clientSecret = 'EGSN-3XZANjg567HDD58wBHF9UrMcuEjWuDp1mYQYT4b6hyD3Azk7MJ04SLbvCBZXmu9Sk42Ym5hZfBN';
    
        return new paypal.core.SandboxEnvironment(
            clientId, clientSecret
        )
    }

    public static async makeAnOrder(items: ShopItem[]) {
        console.log(items)
        let request = new paypal.orders.OrdersCreateRequest()
        request.requestBody({
                                intent: 'CAPTURE',
                                purchase_units: [
                                    {
                                        amount: {
                                            value: '7',
                                            currency_code: 'EUR',
                                            breakdown: {
                                                item_total: {value: '7', currency_code: 'EUR'}
                                            }
                                        },
                                        invoice_id: 'muesli_invoice_id',
                                        items: [{
                                            name: 'Hafer',
                                            unit_amount: {value: '3', currency_code: 'EUR'},
                                            quantity: '1',
                                            sku: 'haf001'
                                        }, {
                                            name: 'Discount',
                                            unit_amount: {value: '4', currency_code: 'EUR'},
                                            quantity: '1',
                                            sku: 'dsc002'
                                        }]
                                    }
                                ]
                            })
        const response = await PaypalService.client().execute(request)
        console.log('pp resp: ' +  JSON.stringify(response))
        return response
    }
}