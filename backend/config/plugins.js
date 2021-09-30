module.exports = ({ env }) => ({
  email: {
    provider: "sendgrid",
    providerOptions: {
      apiKey: env("SENDGRID_API_KEY"),
    },
    settings: {
      defaultFrom: "robkellen.developer@gmail.com",
      defaultTo: "robkellen.developer@gmail.com",
    },
  },
});
