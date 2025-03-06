import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  noindex?: boolean
  nofollow?: boolean
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image = '/images/og-image.png',
  noindex = false,
  nofollow = false,
}) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { locale } = router

  const siteTitle = t('title')
  const siteDescription = t('description')
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const fullDescription = description || siteDescription
  const canonical = `https://fakedeepseek.vercel.app${router.asPath}`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={image} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Alternate language versions */}
      <link
        rel="alternate"
        href={`https://fakedeepseek.vercel.app${router.asPath}`}
        hrefLang="x-default"
      />
      {router.locales?.map((loc) => (
        <link
          key={loc}
          rel="alternate"
          href={`https://fakedeepseek.vercel.app${router.asPath}`}
          hrefLang={loc}
        />
      ))}

      {/* Robots meta */}
      <meta
        name="robots"
        content={`${noindex ? 'noindex' : 'index'}, ${
          nofollow ? 'nofollow' : 'follow'
        }`}
      />

      {/* Additional meta tags */}
      <meta name="language" content={locale} />
      <meta name="author" content="@1zhaofengyue" />
      <meta name="theme-color" content="#3B82F6" />
    </Head>
  )
}

export default SEO 