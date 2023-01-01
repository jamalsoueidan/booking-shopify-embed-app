interface Notification {
  _id: string;
  orderId: number;
  lineItemId?: number;
  message: string;
  receiver: string;
  scheduled: Date;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
  isStaff: boolean;
  batchId: string;
  shop: string;
}

interface NotificationQuery {
  orderId: number;
  lineItemId: number;
}

interface NotificationBody {
  to: "customer" | "staff";
  message: string;
}

/*
  {
    "status": "success",
    "messageCode": 5000,
    "result": {
      "totalCreditSum": 1,
      "messageSize": 1,
      "batchId": "bb3ddc53-8969-6d90-de09-134d570c28c1",
      "report": {
        "accepted": [
          {
            "receiver": "4531317428",
            "country": "Denmark",
            "countryCode": "DK",
            "creditCost": 1
          }
        ],
        "rejected": []
      }
    }
  }
*/
declare module SMSDK {
  export interface Accepted {
    receiver: string;
    country: string;
    countryCode: string;
    creditCost: number;
  }

  export interface Report {
    accepted: Accepted[];
    rejected: any[];
  }

  export interface Result {
    totalCreditSum: number;
    messageSize: number;
    batchId: string;
    report: Report;
  }

  export interface Response {
    status: string;
    messageCode: number;
    result: Result;
  }
}
