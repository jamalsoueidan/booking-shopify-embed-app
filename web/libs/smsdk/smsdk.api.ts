import axios, { AxiosResponse } from "axios";
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

module SMSDK {
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

interface SendProps {
  receiver: string | number;
  message: string;
  scheduled: Date;
}

const send = async ({ receiver, message, scheduled }: SendProps) => {
  const response: AxiosResponse<SMSDK.Response> = await axios.post(
    "https://api.sms.dk/v1/sms/send",
    {
      receiver,
      message,
      senderName: "BySisters",
      scheduled: scheduled ? scheduled.toISOString().slice(0, -1) : null,
    },
    {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer 4dcc09f3-68e2-11ed-8524-005056010a37",
      },
    }
  );

  return response.data;
};

const cancel = async (batchId: string) => {
  const response = await axios.delete(
    `https://api.sms.dk/v1/sms/delete?batchId=${batchId}`,
    {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer 4dcc09f3-68e2-11ed-8524-005056010a37",
      },
    }
  );
  return response;
};

export default { send, cancel };
