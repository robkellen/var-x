"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  // set the author of a review to the logged in user
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.review.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.review.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.review });
  },

  // allow the logged in user to update a review they have created
  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [review] = await strapi.services.review.find({
      id,
      user: ctx.state.user.id,
    });

    if (!review) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.review.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.review.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.review });
  },

  // allow the logged in user to delete a review they have posted
  async delete(ctx) {
    const { id } = ctx.params;

    const [review] = await strapi.services.review.find({
      id,
      user: ctx.state.user.id,
    });

    if (!review) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    const entity = await strapi.services.review.delete({ id });
    await strapi.services.review.average(entity.product.id);
    return sanitizeEntity(entity, { model: strapi.models.review });
  },
};
