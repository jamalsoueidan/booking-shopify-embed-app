import mongoose from "mongoose";

export interface IShopifySession {
  state: string;
  isOnline: boolean;
  shop: string;
  accessToken: string;
  scope: string;
}

const ShopifySessionSchema = new mongoose.Schema({
  id: String,
  state: String,
  shop: {
    type: String,
    required: true,
    index: true,
  },
  isOnline: Boolean,
  accessToken: String,
  scope: String,
});

export default mongoose.model<IShopifySession>(
  "shopify_sessions",
  ShopifySessionSchema,
  "shopify_sessions"
);
