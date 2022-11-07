import * as Booking from "../database/models/booking.model.js";

/**
 * @typedef Property
 * @type {object}
 * @property {string} name
 * @property {string} value
 */

/**
 * @typedef LineItems
 * @type {object}
 * @property {string} id
 * @property {string} product_id
 * @property {Property[]} properties
 */

/**
 * @typedef Body
 * @type {object}
 * @property {LineItem[]} line_items
 * @property {string} shop
 */

/** @param {Body} body  */
export const createOrUpdate = (body) => {
  /** @param {LineItems} lineItem  */
  const filter = (lineItem) => {
    return lineItem.properties.find((property) => {
      return (
        property.name === "Staff" ||
        property.name === "Date" ||
        property.name === "Hour"
      );
    });
  };

  /** @type {LineItems[]} */
  const lineItems = body.line_items.filter(filter);
  const models = lineItems.map((lineItem) => {
    const date = lineItem.properties.find((p) => p.name === "Date")?.value;
    const hour = lineItem.properties.find((p) => p.name === "Hour")?.value;
    const hours = hour.slice(0, 2);
    const minutes = hour.slice(3);
    const completeDate = new Date(date);
    completeDate.setHours(hours, minutes);
    return {
      productId: parseInt(lineItem.product_id),
      staffId: parseInt(
        lineItem.properties.find((p) => p.name === "Staff")?.value
      ),
      date: completeDate.toISOString(),
      shop: body.shop,
    };
  });

  models.forEach((m) => {
    //Booking.findOneAndUpdate(m);
  });

  console.log(models);
};
