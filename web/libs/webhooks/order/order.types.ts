declare namespace OrderTypes {
  export interface Staff {
    _id: string;
    fullname: string;
    avatar: string;
    position: string;
    anyAvailable?: boolean;
  }

  export interface Data {
    start: string;
    end: string;
    staff: Staff;
    timeZone: string;
  }

  export interface ClientDetails {
    accept_language: string;
    browser_height?: any;
    browser_ip: string;
    browser_width?: any;
    session_hash?: any;
    user_agent: string;
  }

  export interface ShopMoney {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney {
    amount: string;
    currency_code: string;
  }

  export interface CurrentSubtotalPriceSet {
    shop_money: ShopMoney;
    presentment_money: PresentmentMoney;
  }

  export interface ShopMoney2 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney2 {
    amount: string;
    currency_code: string;
  }

  export interface CurrentTotalDiscountsSet {
    shop_money: ShopMoney2;
    presentment_money: PresentmentMoney2;
  }

  export interface ShopMoney3 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney3 {
    amount: string;
    currency_code: string;
  }

  export interface CurrentTotalPriceSet {
    shop_money: ShopMoney3;
    presentment_money: PresentmentMoney3;
  }

  export interface ShopMoney4 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney4 {
    amount: string;
    currency_code: string;
  }

  export interface CurrentTotalTaxSet {
    shop_money: ShopMoney4;
    presentment_money: PresentmentMoney4;
  }

  export interface ShopMoney5 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney5 {
    amount: string;
    currency_code: string;
  }

  export interface SubtotalPriceSet {
    shop_money: ShopMoney5;
    presentment_money: PresentmentMoney5;
  }

  export interface ShopMoney6 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney6 {
    amount: string;
    currency_code: string;
  }

  export interface TotalDiscountsSet {
    shop_money: ShopMoney6;
    presentment_money: PresentmentMoney6;
  }

  export interface ShopMoney7 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney7 {
    amount: string;
    currency_code: string;
  }

  export interface TotalLineItemsPriceSet {
    shop_money: ShopMoney7;
    presentment_money: PresentmentMoney7;
  }

  export interface ShopMoney8 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney8 {
    amount: string;
    currency_code: string;
  }

  export interface TotalPriceSet {
    shop_money: ShopMoney8;
    presentment_money: PresentmentMoney8;
  }

  export interface ShopMoney9 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney9 {
    amount: string;
    currency_code: string;
  }

  export interface TotalShippingPriceSet {
    shop_money: ShopMoney9;
    presentment_money: PresentmentMoney9;
  }

  export interface ShopMoney10 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney10 {
    amount: string;
    currency_code: string;
  }

  export interface TotalTaxSet {
    shop_money: ShopMoney10;
    presentment_money: PresentmentMoney10;
  }

  export interface BillingAddress {
    first_name: string;
    phone?: any;
    province?: any;
    country: string;
    last_name: string;
    company?: any;
    latitude: number;
    longitude: number;
    name: string;
    country_code: string;
    province_code?: any;
  }

  export interface EmailMarketingConsent {
    state: string;
    opt_in_level: string;
    consent_updated_at?: any;
  }

  export interface DefaultAddress {
    id: number;
    customer_id: number;
    first_name: string;
    last_name: string;
    company?: any;
    province?: any;
    country: string;
    phone?: any;
    name: string;
    province_code?: any;
    country_code: string;
    country_name: string;
    default: boolean;
  }

  export interface Customer {
    id: number;
    email: string;
    accepts_marketing: boolean;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    state: string;
    note?: any;
    verified_email: boolean;
    multipass_identifier?: any;
    tax_exempt: boolean;
    tags: string;
    currency: string;
    phone?: any;
    accepts_marketing_updated_at: string;
    marketing_opt_in_level?: any;
    tax_exemptions: any[];
    email_marketing_consent: EmailMarketingConsent;
    sms_marketing_consent?: any;
    admin_graphql_api_id: string;
    default_address: DefaultAddress;
  }

  export interface DiscountApplication {
    target_type: string;
    type: string;
    value: string;
    value_type: string;
    allocation_method: string;
    target_selection: string;
    title: string;
  }

  export interface ShopMoney11 {
    amount?: string;
    currency_code: string;
  }

  export interface PresentmentMoney11 {
    amount: string;
    currency_code: string;
  }

  export interface PriceSet {
    shop_money: ShopMoney11;
    presentment_money: PresentmentMoney11;
  }

  export interface Property {
    name: string;
    value: string;
  }

  export interface ShopMoney12 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney12 {
    amount: string;
    currency_code: string;
  }

  export interface TotalDiscountSet {
    shop_money: ShopMoney12;
    presentment_money: PresentmentMoney12;
  }

  export interface ShopMoney13 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney13 {
    amount: string;
    currency_code: string;
  }

  export interface AmountSet {
    shop_money: ShopMoney13;
    presentment_money: PresentmentMoney13;
  }

  export interface DiscountAllocation {
    amount: string;
    amount_set: AmountSet;
    discount_application_index: number;
  }

  export interface LineItem {
    id: any;
    admin_graphql_api_id: string;
    fulfillable_quantity: number;
    fulfillment_service: string;
    fulfillment_status?: any;
    gift_card: boolean;
    grams: number;
    name: string;
    price: string;
    price_set: PriceSet;
    product_exists: boolean;
    product_id: any;
    properties: Property[];
    quantity: number;
    requires_shipping: boolean;
    sku: string;
    taxable: boolean;
    title: string;
    total_discount: string;
    total_discount_set: TotalDiscountSet;
    variant_id: any;
    variant_inventory_management?: any;
    variant_title?: any;
    vendor: string;
    tax_lines: any[];
    duties: any[];
    discount_allocations: DiscountAllocation[];
  }

  export interface PaymentDetails {
    credit_card_bin: string;
    avs_result_code?: any;
    cvv_result_code?: any;
    credit_card_company: string;
  }

  export interface Order {
    id: number;
    admin_graphql_api_id: string;
    app_id: number;
    browser_ip: string;
    buyer_accepts_marketing: boolean;
    cancel_reason?: any;
    cancelled_at?: any;
    cart_token: string;
    checkout_id: number;
    checkout_token: string;
    client_details: ClientDetails;
    closed_at?: any;
    confirmed: boolean;
    contact_email: string;
    created_at: string;
    currency: string;
    current_subtotal_price?: string;
    current_subtotal_price_set?: CurrentSubtotalPriceSet;
    current_total_discounts: string;
    current_total_discounts_set: CurrentTotalDiscountsSet;
    current_total_duties_set?: any;
    current_total_price: string;
    current_total_price_set: CurrentTotalPriceSet;
    current_total_tax: string;
    current_total_tax_set: CurrentTotalTaxSet;
    customer_locale: string;
    device_id?: any;
    discount_codes: any[];
    email: string;
    estimated_taxes: boolean;
    financial_status: string;
    fulfillment_status?: any;
    gateway: string;
    landing_site: string;
    landing_site_ref?: any;
    location_id?: any;
    merchant_of_record_app_id?: any;
    name: string;
    note: string;
    note_attributes: any[];
    number: number;
    order_number: number;
    order_status_url: string;
    original_total_duties_set?: any;
    payment_gateway_names: string[];
    phone?: any;
    presentment_currency: string;
    processed_at: string;
    processing_method: string;
    reference: string;
    referring_site: string;
    source_identifier: string;
    source_name: string;
    source_url?: any;
    subtotal_price: string;
    subtotal_price_set: SubtotalPriceSet;
    tags: string;
    tax_lines: any[];
    taxes_included: boolean;
    test: boolean;
    token: string;
    total_discounts: string;
    total_discounts_set: TotalDiscountsSet;
    total_line_items_price: string;
    total_line_items_price_set: TotalLineItemsPriceSet;
    total_outstanding: string;
    total_price: string;
    total_price_set: TotalPriceSet;
    total_shipping_price_set: TotalShippingPriceSet;
    total_tax: string;
    total_tax_set: TotalTaxSet;
    total_tip_received: string;
    total_weight: number;
    user_id?: any;
    billing_address: BillingAddress;
    customer: Customer;
    discount_applications: DiscountApplication[];
    fulfillments: any[];
    line_items: LineItem[];
    payment_details: PaymentDetails;
    payment_terms?: any;
    refunds?: Refund.Refund[];
    shipping_lines: any[];
  }
}

declare namespace Refund {
  export interface ShopMoney {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney {
    amount: string;
    currency_code: string;
  }

  export interface TotalDutiesSet {
    shop_money: ShopMoney;
    presentment_money: PresentmentMoney;
  }

  export interface Receipt {
    paid_amount: string;
  }

  export interface PaymentDetails {
    credit_card_bin: string;
    avs_result_code?: any;
    cvv_result_code?: any;
    credit_card_company: string;
  }

  export interface Transaction {
    id: number;
    admin_graphql_api_id: string;
    amount: string;
    authorization?: any;
    created_at: string;
    currency: string;
    device_id?: any;
    error_code?: any;
    gateway: string;
    kind: string;
    location_id?: any;
    message: string;
    order_id: number;
    parent_id: number;
    processed_at: string;
    receipt: Receipt;
    source_name: string;
    status: string;
    test: boolean;
    user_id: number;
    payment_details: PaymentDetails;
  }

  export interface ShopMoney2 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney2 {
    amount: string;
    currency_code: string;
  }

  export interface SubtotalSet {
    shop_money: ShopMoney2;
    presentment_money: PresentmentMoney2;
  }

  export interface ShopMoney3 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney3 {
    amount: string;
    currency_code: string;
  }

  export interface TotalTaxSet {
    shop_money: ShopMoney3;
    presentment_money: PresentmentMoney3;
  }

  export interface ShopMoney4 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney4 {
    amount: string;
    currency_code: string;
  }

  export interface PriceSet {
    shop_money: ShopMoney4;
    presentment_money: PresentmentMoney4;
  }

  export interface Property {
    name: string;
    value: string;
  }

  export interface ShopMoney5 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney5 {
    amount: string;
    currency_code: string;
  }

  export interface TotalDiscountSet {
    shop_money: ShopMoney5;
    presentment_money: PresentmentMoney5;
  }

  export interface ShopMoney6 {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney6 {
    amount: string;
    currency_code: string;
  }

  export interface AmountSet {
    shop_money: ShopMoney6;
    presentment_money: PresentmentMoney6;
  }

  export interface DiscountAllocation {
    amount: string;
    amount_set: AmountSet;
    discount_application_index: number;
  }

  export interface LineItem {
    id: number;
    admin_graphql_api_id: string;
    fulfillable_quantity: number;
    fulfillment_service: string;
    fulfillment_status?: any;
    gift_card: boolean;
    grams: number;
    name: string;
    price: string;
    price_set: PriceSet;
    product_exists: boolean;
    product_id: number;
    properties: Property[];
    quantity: number;
    requires_shipping: boolean;
    sku: string;
    taxable: boolean;
    title: string;
    total_discount: string;
    total_discount_set: TotalDiscountSet;
    variant_id: number;
    variant_inventory_management?: any;
    variant_title?: any;
    vendor: string;
    tax_lines: any[];
    duties: any[];
    discount_allocations: DiscountAllocation[];
  }

  export interface RefundLineItem {
    id: number;
    line_item_id: number;
    location_id: number;
    quantity: number;
    restock_type: string;
    subtotal: number;
    subtotal_set: SubtotalSet;
    total_tax: number;
    total_tax_set: TotalTaxSet;
    line_item: LineItem;
  }

  export interface Refund {
    id: number;
    admin_graphql_api_id: string;
    created_at: string;
    note: string;
    order_id: number;
    processed_at: string;
    restock: boolean;
    total_duties_set: TotalDutiesSet;
    user_id: number;
    order_adjustments: any[];
    transactions: Transaction[];
    refund_line_items: RefundLineItem[];
    duties: any[];
  }
}
