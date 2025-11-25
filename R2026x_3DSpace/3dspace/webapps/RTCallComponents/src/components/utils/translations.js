import { requirejs } from '../../modules/require'
// import { isRunningInTest } from '../../api/callhistory_api'

export function useTranslations(filename, path = 'i18n!DS/RTCallComponents/assets/nls/') {
  let i18n = {};
  const promise = new Promise(async (resolve) => {
    try {
      const [result] = await requirejs([`${path}${filename}`])
      i18n = Object.assign(i18n, result)
    }
    catch (error) {
      console.error(`Error loading nls ${path}${filename}`)
    }

    // override with local values if in mode dev
    // in dev, we want to get the most recently created translations
    // if (isRunningInTest) {
    //   try {
    //     const result = await modules[`../../../assets/nls/${filename}_en.json`]() 
    //     if (DS_LANG === 'en')
    //       i18n.value = Object.assign(i18n.value, NLS)
    //     else
    //       i18n.value = { ...result.default, ...i18n.value }
    //   }
    //   catch (error) {
    //     console.error(error)
    //   }
    // }

    resolve(i18n.value)
  })

  const $i18n = (key, values = {}) => {
    let value = i18n[key] || ''
    Object.entries(values)
      .forEach(([k, val]) => {
        value = value.replace(`{${k}}`, val)
      })

    return value
  }

  return { i18n, $i18n, promise }
}
