declare module Customer {
  export interface Address {
    id: number;
    customer_id: number;
    first_name: string;
    last_name: string;
    company: string;
    city: string;
    province: string;
    country: string;
    phone: string;
    name: string;
    province_code?: any;
    country_code: string;
    country_name: string;
    default: boolean;
  }

  export interface EmailMarketingConsent {
    state: string;
    opt_in_level: string;
    consent_updated_at?: any;
  }

  export interface SmsMarketingConsent {
    state: string;
    opt_in_level: string;
    consent_updated_at?: any;
    consent_collected_from: string;
  }

  export interface DefaultAddress {
    id: number;
    customer_id: number;
    first_name: string;
    last_name: string;
    company: string;
    city: string;
    province: string;
    country: string;
    phone: string;
    name: string;
    province_code?: any;
    country_code: string;
    country_name: string;
    default: boolean;
  }

  export interface Data {
    id: number;
    email: string;
    accepts_marketing: boolean;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    orders_count: number;
    state: string;
    total_spent: string;
    last_order_id?: any;
    note?: any;
    verified_email: boolean;
    multipass_identifier?: any;
    tax_exempt: boolean;
    tags: string;
    last_order_name?: any;
    currency: string;
    phone: string;
    addresses: Address[];
    accepts_marketing_updated_at: string;
    marketing_opt_in_level?: any;
    tax_exemptions: any[];
    email_marketing_consent: EmailMarketingConsent;
    sms_marketing_consent: SmsMarketingConsent;
    admin_graphql_api_id: string;
    default_address: DefaultAddress;
  }
}
