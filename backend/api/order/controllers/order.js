"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");

// guest account
const GUEST_ID = "61707da7f2996738259967bd";

module.exports = {
  async place(ctx) {
    // define content of order
    const {
      shippingAddress,
      billingAddress,
      shippingInfo,
      billingInfo,
      shippingOption,
      subtotal,
      tax,
      total,
      items,
    } = ctx.request.body;

    // is user logged in or are they a guest?
    let orderCustomer;

    if (ctx.state.user) {
      orderCustomer = ctx.state.user.id;
    } else {
      orderCustomer = GUEST_ID;
    }

    let serverTotal = 0;
    let unavailable = [];

    await Promise.all(
      items.map(async (clientItem) => {
        const serverItem = await strapi.services.variant.findOne({
          id: clientItem.variant.id,
        });

        // check if item is still in stock
        if (serverItem.qty < clientItem.qty) {
          unavailable.push({ id: serverItem.id, qty: serverItem.qty });
        } else {
          // validate that prices are still the same as the prices in the user cart
          serverTotal += serverItem.price * clientItem.qty;

          // update qty of items available on the server
          await strapi.services.variant.update(
            { id: clientItem.variant.id },
            { qty: serverItem.qty - clientItem.qty }
          );
        }
      })
    );

    const shippingOptions = [
      { label: "FREE SHIPPING", price: 0 },
      { label: "2-DAY SHIPPING", price: 9.99 },
      { label: "OVERNIGHT SHIPPING", price: 29.99 },
    ];

    // validate shipping option & price with info coming in from client
    const shippingValid = shippingOptions.find(
      (option) =>
        option.label === shippingOption.label &&
        option.price === shippingOption.price
    );

    // if either are true then cart is invalid and error is sent to user
    if (
      shippingValid === undefined ||
      (serverTotal * 1.056 + shippingValid.price).toFixed(2) !== total
    ) {
      ctx.sent({ error: "Invalid Cart" }, 400);
    } else if (unavailable.length > 0) {
      ctx.send({ unavailable }, 409);
    } else {
      var order = await strapi.services.order.create({
        shippingAddress,
        billingAddress,
        shippingInfo,
        billingInfo,
        shippingOption,
        subtotal,
        tax,
        total,
        items,
        user: orderCustomer,
      });

      order = sanitizeEntity(order, { model: strapi.models.order });

      // if order placed by a guest do not sent guest profile back to user
      if (order.user.username === "Guest") {
        order.user = { username: Guest };
      }

      ctx.send({ order }, 200);
    }
  },
};
