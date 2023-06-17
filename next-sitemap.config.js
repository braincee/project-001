/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'http://localhost:3000/',
    generateRobotsTxt: true, // (optional)
    robotsTxtOptions: {
      additionalSitemaps: [
        'http://localhost:3000/sitemap.xml',
        'http://localhost:3000/sitemap-0.xml',
      ]
    }
  }