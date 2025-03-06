import { useRouter } from 'next/router'

const LanguageSwitcher = () => {
  const router = useRouter()
  const { locale, locales, pathname, query, asPath } = router

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value
    router.push({ pathname, query }, asPath, { locale })
  }

  return (
    <select
      onChange={changeLanguage}
      value={locale}
      className="bg-gray-700 text-white px-2 py-1 rounded-md"
    >
      {locales?.map((loc) => (
        <option key={loc} value={loc}>
          {loc === 'en' ? 'English' : loc === 'zh' ? '中文' : '日本語'}
        </option>
      ))}
    </select>
  )
}

export default LanguageSwitcher 