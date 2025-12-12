import fs from 'node:fs'
import googleTranslateApi from '@vitalets/google-translate-api'
import bingTranslateApi from 'bing-translate-api'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { HttpProxyAgent } from 'http-proxy-agent'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const agent = new HttpProxyAgent('http://127.0.0.1:7890')

const TRANSLATOR = 'bing'
const BASE_LANG = 'zh-Hans'
const TARGET_LANGS = ['zh-Hant', 'de']
const LOCALE_DIR = path.join(__dirname, '../messages')
const META_DIR = path.join(__dirname, 'meta')
const BASE_DATA_FILE = path.join(LOCALE_DIR, `${BASE_LANG}.json`)
const BASE_META_FILE = path.join(META_DIR, `${BASE_LANG}.meta.json`)

let baseData = {}
let baseMeta = {}

function loadBaseData() {
  baseData = JSON.parse(
    fs.readFileSync(BASE_DATA_FILE, 'utf8')
  )
}

function loadBaseMeta() {
  if (fs.existsSync(BASE_META_FILE)) {
    baseMeta = JSON.parse(fs.readFileSync(BASE_META_FILE, 'utf8'))
  }
}

function sortJsonKeys(jsonFile) {
  if (!fs.existsSync(jsonFile)) {
    return
  }

  // sort keys
  const json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'))
  const sorted = Object.keys(json)
    .sort((a, b) => a.localeCompare(b)) // 字母顺序
    .reduce((acc, key) => {
      acc[key] = json[key];
      return acc;
    }, {});
  fs.writeFileSync(jsonFile, JSON.stringify(sorted, null, 2), 'utf8');

  console.log('Sorted keys:', jsonFile);
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function hashText(text) {
  return crypto.createHash('md5').update(text).digest('hex').slice(0, 8)
}

/** Translate text */
async function translateText(text, lang) {
  console.log(`➡️ Translating (${lang}): ${text}`)
  await sleep(200 + Math.random() * 600)

  switch (TRANSLATOR) {
    case 'bing':
      return bintTranslate(text, lang)
    default:
      return googleTranslate(text, lang)
  }
}

async function googleTranslate(text, lang) {
  try {
    const res = await googleTranslateApi.translate(text, {
      to: lang,
      fetchOptions: { agent }
    })
    return res.text
  } catch (err) {
    console.error(`❌ Translation failed：`, err.message)
    return text // Return original text if failed
  }
}

async function bintTranslate(text, lang) {
  try {
    const res = await bingTranslateApi.translate(text, BASE_LANG, lang)
    return res.translation
  } catch (err) {
    console.error(`❌ Translation failed：`, err.message)
    return text // Return original text if failed
  }
}

async function fillTranslations(
  baseObj,
  targetObj,
  metaObj,
  lang,
  updatedList,
  parentKey = ''
) {
  const result = { ...targetObj }

  for (const key in baseObj) {
    const fullKey = parentKey ? `${parentKey}.${key}` : key
    const baseVal = baseObj[key]
    const targetVal = targetObj?.[key]

    if (typeof baseVal === 'string') {
      const currentHash = hashText(baseVal)
      const oldHash = baseMeta[fullKey]
      const manual = metaObj[fullKey]?.manual
      const manualUpdate = targetVal && manual
      const needUpdate = !targetVal || oldHash !== currentHash

      // missing OR changed
      if (manualUpdate) {
        // ignore
        console.log(`👉🏼 Manual: ${fullKey} → ${targetVal}`)
      } else if (needUpdate) {
        const translated = await translateText(baseVal, lang)
        result[key] = translated

        updatedList.push({
          key: fullKey,
          from: baseVal,
          to: translated,
        })
      }

      // Update meta hash
      baseMeta[fullKey] = currentHash
    } else if (typeof baseVal === 'object' && baseVal !== null) {
      result[key] = await fillTranslations(
        baseVal,
        targetVal || {},
        metaObj,
        lang,
        updatedList,
        fullKey
      )
    }
  }

  return result
}

function prepare() {
  sortJsonKeys(BASE_DATA_FILE)
  sortJsonKeys(BASE_META_FILE)
  loadBaseData()
  loadBaseMeta()
}

async function main() {
  // prepare
  prepare()

  // translate
  console.log(`📌 Translator: ${TRANSLATOR}`)
  console.log(`📌 Base language: ${BASE_LANG}`)
  console.log(`📌 Target languages: ${TARGET_LANGS.join(', ')}`)
  console.log('')

  for (const lang of TARGET_LANGS) {
    const langDataFile = path.join(LOCALE_DIR, `${lang}.json`)
    const langMetaFile = path.join(META_DIR, `${lang}.meta.json`)
    sortJsonKeys(langDataFile)

    console.log('==================================================')
    console.log(`🌍 Translating → ${lang}`)

    let targetObj = {}
    if (fs.existsSync(langDataFile)) {
      targetObj = JSON.parse(fs.readFileSync(langDataFile, 'utf8'))
    }
    let metaObj = {}
    if (fs.existsSync(langMetaFile)) {
      metaObj = JSON.parse(fs.readFileSync(langMetaFile, 'utf8'))
    }

    const updatedList = []
    const merged = await fillTranslations(baseData, targetObj, metaObj, lang, updatedList)

    fs.writeFileSync(langDataFile, JSON.stringify(merged, null, 2), 'utf8')
    console.log(`💾 Saved file：${lang}.json`)

    if (updatedList.length === 0) {
      console.log(`✨ Up to date. No changes.`)
    } else {
      console.log(`🔄 Translated items: ${updatedList.length} ↓`)
      updatedList.forEach((item) =>
        console.log(`  - ${item.key}: '${item.to}'`)
      )
    }

    console.log('==================================================')
    console.log('')
  }

  // Save meta file
  fs.writeFileSync(BASE_META_FILE, JSON.stringify(baseMeta, null, 2), 'utf8')
  console.log(`📝 Updated meta: ${BASE_META_FILE}`)

  console.log('🎉 All languages have been updated completely!')
}

main().catch(console.error)
