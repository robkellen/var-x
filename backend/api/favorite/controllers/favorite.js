"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  // controller to allow logged in user to create a favorited product
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services.favorite.create(data, { files });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services.favorite.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.favorite });
  },

  // controller to allow logged in user to create a favorited product
  async delete(ctx) {
    const { id } = ctx.params;

    // look up to see if we can find the favorite of the logged in user
    const [favorite] = await strapi.services.favorite.find({
      id,
      user: ctx.state.user.id,
    });

    if (!favorite)
      return ctx.unauthorized("You are not authorized to update this entry.");

    const entity = await strapi.services.favorite.delete({ id });
    return sanitizeEntity(entity, { model: strapi.models.favorite });
  },
};
