"use strict";

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

const stripe = require("stripe")(process.env.STRIPE_SK);

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }

  // check for subscriptions every day at 8am
  "0 8 * * *": async () => {
    const subscriptions = await strapi.services.subscription.find({
      next_delivery: new Date(),
    });

    await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        // find payment method in stripe
        const paymentMethods = await stripe.paymentMethods.list({
          customer: subscription.user.stripeID,
          type: "card",
        });

        const paymentMethod = paymentMethods.data.find(
          (method) => method.card.last4 === subscription.paymentMethod.last4
        );

        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(subscription.variant.price * 1.056 * 100),
            currency: "usd",
            customer: subscription.user.stripeID,
            payment_method: paymentMethod.id,
            off_session: true,
            confirm: true,
          });

          // place new order in Strapi
          let order = await strapi.services.order.create({
            shippingAddress: subscription.shippingAddress,
            billingAddress: subscription.billingAddress,
            shippingInfo: subscription.shippingInfo,
            billingInfo: subscription.billingInfo,
            shippingOption: { label: "subscription", price: 0 },
            subtotal: subscription.variant.price,
            total: subscription.variant.price * 1.056,
            tax: subscription.variant.price * 0.056,
            items: [
              {
                variant: subscription.variant,
                name: subscription.name,
                qty: subscription.quantity,
                stock: subscription.variant.qty,
                product: subscription.variant.product,
              },
            ],
            transaction: paymentIntent.id,
            paymentMethod: subscription.paymentMethod,
            user: subscription.user.id,
            subscription: subscription.id,
          });

          const frequencies = await strapi.services.order.frequency();

          // send confirmation email after order has been processed
          const confirmation = await strapi.services.order.confirmationEmail(
            order
          );
          await strapi.plugins["email"].services.email.send({
            to: subscription.billingInfo.email,
            subject: "VAR-X Order Confirmation",
            html: confirmation,
          });

          // update subscription so order date for next delivery date is set for next delivery
          const frequency = frequencies.find(
            (option) => option.value === subscription.frequency
          );
          await strapi.services.subscription.update(
            { id: subscription.id },
            { next_delivery: frequency.delivery() }
          );
        } catch (error) {
          // Notify customer if payment fails, prompt them to enter new information
          // TODO: set up email notification to be sent to customer if this occurs
          console.log(error);
        }
      })
    );
  },
};
