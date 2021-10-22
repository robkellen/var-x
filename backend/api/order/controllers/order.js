"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require("strapi-utils");
const stripe = require("stripe")(process.env.STRIPE_SK);

// guest account
const GUEST_ID = "61707da7f2996738259967bd";

module.exports = {
  // create paymentIntent through Stripe
  async process(ctx) {
    const {
      items,
      total,
      shippingOption,
      idempotencyKey,
      storedIntent,
      email,
    } = ctx.request.body;

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
        }

        // validate that prices are still the same as the prices in the user cart
        serverTotal += serverItem.price * clientItem.qty;
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
      ctx.send({ error: "Invalid Cart" }, 400);
    } else if (unavailable.length > 0) {
      ctx.send({ unavailable }, 409);
    } else {
      // generate paymentIntent and send clientSecret
      if (storedIntent) {
        const update = await stripe.paymentIntents.update(
          storedIntent,
          {
            amount: total * 100,
          },
          { idempotencyKey }
        );

        ctx.send({ client_secret: update.client_secret, intentID: update.id });
      } else {
        const intent = await stripe.paymentIntents.create(
          {
            amount: total * 100,
            currency: "usd",
            customer: ctx.state.user ? ctx.state.user.stripeID : undefined,
            receipt_email: email,
          },
          { idempotencyKey }
        );

        ctx.send({ client_secret: intent.client_secret, intentID: intent.id });
      }
    }
  },

  async finalize(ctx) {
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
      transaction,
      paymentMethod,
      saveCard,
      cardSlot,
    } = ctx.request.body;

    // is user logged in or are they a guest?
    let orderCustomer;

    if (ctx.state.user) {
      orderCustomer = ctx.state.user.id;
    } else {
      orderCustomer = GUEST_ID;
    }

    await Promise.all(
      items.map(async (clientItem) => {
        const serverItem = await strapi.services.variant.findOne({
          id: clientItem.variant.id,
        });

        await strapi.services.variant.update(
          { id: clientItem.variant.id },
          { qty: serverItem.qty - clientItem.qty }
        );
      })
    );

    if (saveCard && ctx.state.user) {
      let newMethods = [...ctx.state.user.paymentMethods];

      newMethods[cardSlot] = paymentMethod;

      await strapi.plugins["users-permissions"].services.user.edit(
        { id: orderCustomer },
        { paymentMethods: newMethods }
      );
    }

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
      transaction,
      paymentMethod,
      user: orderCustomer,
    });

    order = sanitizeEntity(order, { model: strapi.models.order });

    // if order placed by a guest do not sent guest profile back to user
    if (order.user.username === "Guest") {
      order.user = { username: "Guest" };
    }

    ctx.send({ order }, 200);
  },
};
