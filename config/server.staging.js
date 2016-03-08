module.exports = {
  // Run-time
  name: 'staging',

  // Build-time
  eslintFix: true,

  // Run-time and build-time
  platform: 'server',
  environment: 'production',
  enableStats: false,

  // Const
  googleAnalytics: 'UA-44093216-4',
  facebookAppId: '172832916399347',
  facebookSecret: 'e3e3575817b30084be83bb89c613cea5',
  homeUrl: 'https://staging.splitme.net/',
  couchUrl: 'http://localhost:5984',
  couchUsername: 'olivier',
  couchPassword: 'anihilus1302',
};
