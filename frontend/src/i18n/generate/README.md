# i18n generate

## generate
```shell
node src/i18n/generate/index.js
node src/i18n/generate/index.js --base=zh-Hans

# or
yarn i18n-generate
yarn i18n-generate-zh
```

## All Languages
All languages defined in `config/language.json`:

- label: Display name in UI
- value: language tag (IETF)
- locale: Locale (Used for locale, dayjs, etc.)
- prompt_name: Prompt name
- supported: Supported or not
- generate: Auto generate or not

### Add new language
1. Add new language item in `src/i18n/generate/config/language.json`
2. Add new dayjs locale import in `core/utils/dayjs.ts`
3. Generate by `yarn i18n-generate`

### Links

- [IETF language tag](https://www.venea.net/web/culture-code)
