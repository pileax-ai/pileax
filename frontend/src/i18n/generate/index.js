import fs from 'node:fs'
import googleTranslateApi from '@vitalets/google-translate-api'
import bingTranslateApi from 'bing-translate-api'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { HttpProxyAgent } from 'http-proxy-agent'
import languages from './config/languages.json' with { type: 'json' }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const agent = new HttpProxyAgent('http://127.0.0.1:7890')

const TRANSLATOR = 'bing'
const BASE_LANG = 'en-US'
const MANUAL_LANGS = ['en-US', 'zh-Hans', 'zh-Hant']
const TARGET_LANGS = languages.filter(item => item.supported)

const ROOT_FILES = ['common.ts']
const LOCALE_DIR = path.join(__dirname, '../messages')
const BASE_LANG_DIR = path.join(LOCALE_DIR, BASE_LANG)
const META_DIR = path.join(__dirname, 'meta')
const BASE_META_FILE = path.join(META_DIR, `${BASE_LANG}.meta.json`)

// ==================================================
// Utility
// ==================================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function hashText(text) {
  return crypto.createHash('md5').update(text).digest('hex').slice(0, 8)
}

function getLanguageKey(lang) {
  if (lang === 'zh-Hans' || lang === 'zh-Hant') {
    return lang
  } else {
    return lang.split('-')[0]
  }
}

function sortDeep(obj) {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map(sortDeep)

  return Object.keys(obj)
    .sort((a, b) => a.localeCompare(b))
    .reduce((acc, key) => {
      acc[key] = sortDeep(obj[key])
      return acc
    }, {})
}

function sortJsonKeys(jsonFile) {
  if (!fs.existsSync(jsonFile)) {
    return
  }

  // sort keys
  const json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'))
  const sorted = sortDeep(json)
  fs.writeFileSync(jsonFile, JSON.stringify(sorted, null, 2), 'utf8')

  console.log('⛵ Sorted keys:', jsonFile)
}

// ==================================================
// Load/Write ts files
// ==================================================
function loadTsObject(filePath) {
  const code = fs.readFileSync(filePath, 'utf8')
  const match = code.match(/export\s+default\s+({[\s\S]*})\s*$/)

  if (!match) {
    throw new Error(`Invalid i18n ts file format: ${filePath}`)
  }

  return eval(`(${match[1]})`)
}

function writeTsFile(filePath, data) {
  const content =
    `export default ${serializeToTs(sortDeep(data), 2)}
`
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
}

function serializeToTs(obj, indent = 2, level = 0) {
  const pad = ' '.repeat(indent * level)
  const padInner = ' '.repeat(indent * (level + 1))

  if (typeof obj === 'string') {
    return `'${obj.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'
    return `[\n${obj
      .map(v => `${padInner}${serializeToTs(v, indent, level + 1)}`)
      .join(',\n')}\n${pad}]`
  }

  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj)
    if (entries.length === 0) return '{}'

    return `{\n${entries
      .map(([key, val]) => {
        return `${padInner}${key}: ${serializeToTs(val, indent, level + 1)}`
      })
      .join(',\n')}\n${pad}}`
  }

  // number / boolean / null
  return String(obj)
}

// ==================================================
// Translate
// ==================================================
async function translateText(text, lang) {
  console.log(`➡️ Translating (${lang.value}): ${text}`)
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
      to: lang.value,
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
    const res = await bingTranslateApi.translate(
      text,
      getLanguageKey(BASE_LANG),
      getLanguageKey(lang.value)
    )
    return res.translation
  } catch (err) {
    console.error(`❌ Translation failed：`, err.message)
    return text // Return original text if failed
  }
}

// ==================================================
// Fill Translation
// ==================================================
let baseMeta = {}

function loadBaseMeta() {
  if (fs.existsSync(BASE_META_FILE)) {
    baseMeta = JSON.parse(fs.readFileSync(BASE_META_FILE, 'utf8'))
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

// ==================================================
// Main process
// ==================================================
function sortBaseFiles() {
  const baseFiles = getLocaleFiles(BASE_LANG_DIR)
  for (const file of baseFiles) {
    const filePath = path.join(BASE_LANG_DIR, file)
    if (!fs.existsSync(filePath)) continue

    const obj = loadTsObject(filePath)
    const sortedObj = sortDeep(obj)
    writeTsFile(filePath, sortedObj)
  }
  console.log(`⛵ Sorted base file: ${BASE_LANG_DIR}`)
}

function prepare() {
  sortBaseFiles()
  sortJsonKeys(BASE_META_FILE)
  loadBaseMeta()
}

function getLocaleFiles(langDir) {
  return fs.readdirSync(langDir)
    .filter(f => f.endsWith('.ts') && f !== 'index.ts')
}

function getRootKey(fileName) {
  return ROOT_FILES.includes(fileName)
    ? ''
    : fileName.replace('.ts', '')
}

function copyIndexFile(langDir, lang) {
  const baseIndexFile = path.join(BASE_LANG_DIR, 'index.ts')
  const targetIndexFile = path.join(langDir, 'index.ts')
  if (fs.existsSync(baseIndexFile)) {
    fs.copyFileSync(baseIndexFile, targetIndexFile)
    console.log(`📄 Copied index.ts to ${lang}`)
  }
}

async function main() {
  // prepare
  prepare()

  // translate
  console.log(`📌 Translator: ${TRANSLATOR}`)
  console.log(`📌 Base language: ${BASE_LANG}`)
  console.log(`📌 Target languages: ${TARGET_LANGS.map(item => item.value).join(', ')}`)
  console.log('')

  const baseFiles = getLocaleFiles(BASE_LANG_DIR)
  for (const lang of TARGET_LANGS) {
    console.log('============================================================')

    if (MANUAL_LANGS.includes(lang.value)) {
      console.log(`👉🏻 Translate manually → ${lang.value} | ${lang.prompt_name}`)
      continue
    }

    console.log(`🌍 Translating → ${lang.value} | ${lang.prompt_name}`)

    // Target lang dir
    const langDir = path.join(LOCALE_DIR, lang.value)
    fs.mkdirSync(langDir, { recursive: true })
    copyIndexFile(langDir, lang.value)

    // Target lang meta
    const langMetaFile = path.join(META_DIR, `${lang.value}.meta.json`)
    const metaObj = fs.existsSync(langMetaFile)
      ? JSON.parse(fs.readFileSync(langMetaFile, 'utf8'))
      : {}


    // Translate
    for (const file of baseFiles) {
      console.log('--------------------')
      const baseFile = path.join(BASE_LANG_DIR, file)
      const targetFile = path.join(langDir, file)

      const baseObj = loadTsObject(baseFile)
      const targetObj = fs.existsSync(targetFile)
        ? loadTsObject(targetFile)
        : {}

      const updatedList = []
      const rootKey = getRootKey(file)

      const merged = await fillTranslations(
        baseObj,
        targetObj,
        metaObj,
        lang,
        updatedList,
        rootKey
      )

      writeTsFile(targetFile, merged)

      if (updatedList.length) {
        console.log(`🔄 ${file}: ${updatedList.length} updated`)
      } else {
        console.log(`✨ ${file}: up to date`)
      }
    }

    console.log('============================================================')
    console.log('')
  }

  // Save meta file
  fs.mkdirSync(META_DIR, { recursive: true })
  fs.writeFileSync(BASE_META_FILE, JSON.stringify(baseMeta, null, 2), 'utf8')
  console.log(`📝 Updated meta: ${BASE_META_FILE}`)

  console.log('')
  console.log('🎉 All languages have been updated completely!')
}

main().catch(console.error)
