module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  cron: { enabled: true },
  url: env("URL", "http://localhost"),
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "a51cf181326f38cb89eff55bec4f6474"),
    },
  },
});
