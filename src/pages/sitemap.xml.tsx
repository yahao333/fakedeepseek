import { GetServerSideProps } from 'next'
import { i18n } from '../../next-i18next.config'

const Sitemap = () => null

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://fakedeepseek.vercel.app'
  const pages = ['']  // Add more pages as your site grows

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${pages
        .map((page) => {
          return `
        <url>
          <loc>${baseUrl}${page}</loc>
          ${i18n.locales
            .map(
              (locale) => `
            <xhtml:link
              rel="alternate"
              hreflang="${locale}"
              href="${baseUrl}/${locale}${page}"/>
          `
            )
            .join('')}
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
      `
        })
        .join('')}
    </urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default Sitemap 