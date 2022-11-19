declare module CartTypes {
  export interface Properties {
    staff?: string;
    date?: string;
    time?: string;
    _data?: string;
  }

  export interface ShopMoney {
    amount: string;
    currency_code: string;
  }

  export interface PresentmentMoney {
    amount: string;
    currency_code: string;
  }

  export interface DiscountedPriceSet {
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

  export interface LinePriceSet {
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

  export interface OriginalLinePriceSet {
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

  export interface LineItem {
    id: number;
    properties: Properties;
    quantity: number;
    variant_id: number;
    key: string;
    discounted_price: string;
    discounts: any[];
    gift_card: boolean;
    grams: number;
    line_price: string;
    original_line_price: string;
    original_price: string;
    price: string;
    product_id: number;
    sku: string;
    taxable: boolean;
    title: string;
    total_discount: string;
    vendor: string;
    discounted_price_set: DiscountedPriceSet;
    line_price_set: LinePriceSet;
    original_line_price_set: OriginalLinePriceSet;
    price_set: PriceSet;
    total_discount_set: TotalDiscountSet;
  }

  export interface Data {
    id: string;
    token: string;
    line_items: LineItem[];
    note?: any;
    updated_at: string;
    created_at: string;
  }
}
