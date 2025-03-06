import { GetServerSideProps } from 'next'

const Robots = () => null

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://fakedeepseek.vercel.app'
  
  const robotsTxt = `# *
User-agent: *
Allow: /

# Host
Host: ${baseUrl}

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml`

  res.setHeader('Content-Type', 'text/plain')
  res.write(robotsTxt)
  res.end()

  return {
    props: {},
  }
}

export default Robots 