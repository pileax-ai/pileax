// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app/wrappers'
import { fileURLToPath } from 'node:url'
import path from 'path'
import { viteConfig } from './core/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng'

export default defineConfig((ctx) => {
  console.log('ctx', ctx)
  let mode = ctx.modeName
  const targetName = (ctx as Indexable).targetName
  if (targetName) mode += '-' + targetName
  return {
    // https://v2.quasar.dev/quasar-cli-vite/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: [
      'axios',
      'component',
      'i18n',
      'router',
      'tauri',
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
    css: [
      'app.scss',
      'animation.scss',
      'electron.scss',
      'pi.scss',
      'tauri.scss',
      'themes.scss',
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      'mdi-v7',
      // 'fontawesome-v6',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
      'material-icons-outlined', // optional, you are not bound to it
    ],

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
    build: {
      target: {
        // browser: [ 'es2022', 'firefox115', 'chrome115', 'safari14' ],
        browser: [ 'es2022' ],
        node: 'node20'
      },

      typescript: {
        strict: true,
        vueShim: true
        // extendTsConfig (tsConfig) {}
      },

      vueRouterMode: 'history', // available values: 'hash', 'history'
      distDir: 'dist/' + mode,
      // vueRouterBase,
      // vueDevtools,
      // vueOptionsAPI: false,

      // rebuildCache: true, // rebuilds Vite/linter/etc cache on startup

      // publicPath: '/',
      analyze: process.env.analyze === 'true',
      // env: {},
      // rawDefine: {}
      // ignorePublicFolder: true,
      // minify: false,
      // polyfillModulePreload: true,
      // distDir
      envFolder: 'env',
      rawDefine: viteConfig(ctx).rawDefine,

      extendViteConf: (config) => ({
        optimizeDeps: {
          exclude: ['src/js/foliate-js/vendor/pdfjs/pdf.mjs']
        },
        build: {
          rollupOptions: {
            external: [
              '/src/js/foliate-js/vendor/pdfjs/pdf.mjs'
            ]
          },
          // assetsInclude: ['**/*.mjs']
        }
      }),
      // viteVuePluginOptions: {},

      vitePlugins: [
        ['@intlify/unplugin-vue-i18n/vite', {
          // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
          // compositionOnly: false,

          // if you want to use named tokens in your Vue I18n messages, such as 'Hello {name}',
          // you need to set `runtimeOnly: false`
          // runtimeOnly: false,

          ssr: ctx.modeName === 'ssr',

          // you need to set i18n resource including paths !
          include: [ fileURLToPath(new URL('./src/i18n', import.meta.url)) ]
        }],

        ['vite-plugin-checker', {
          vueTsc: false,
          eslint: {
            lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
            useFlatConfig: true
          }
        }, { server: false }],
        createSvgIconsPlugin({
          iconDirs: [ fileURLToPath(new URL('./public/icons/svg', import.meta.url)) ],
        }),
      ],
      alias: {
        'core': path.resolve(__dirname, 'core'),
        'js': path.resolve(__dirname, 'src/js'),
        'pages': path.resolve(__dirname, 'src/pages'),
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
    devServer: {
      // https: true,
      port: 21800,
      open: false // opens browser window automatically
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
    framework: {
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import strategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [
        'AppFullscreen',
        'Dialog',
        'Meta',
        'Notify',
        'Cookies',
        'LocalStorage',
        'LoadingBar',
      ]
    },

    // animations: 'all', // --- includes all animations
    // https://v2.quasar.dev/options/animations
    animations: [
      'slideInDown',
      'slideOutDown',
      'slideInLeft',
      'slideOutLeft',
      'slideInRight',
      'slideOutRight',
      'slideInUp',
      'slideOutUp',
      'fadeIn',
      'fadeOut',
      'fadeInRight',
      'fadeOutRight',
    ],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#sourcefiles
    // sourceFiles: {
    //   rootComponent: 'src/App.vue',
    //   router: 'src/router/index',
    //   store: 'src/store/index',
    //   pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
    //   pwaServiceWorker: 'src-pwa/custom-service-worker',
    //   pwaManifestFile: 'src-pwa/manifest.json',
    //   electronMain: 'src-electron/electron-main',
    //   electronPreload: 'src-electron/electron-preload'
    //   bexManifestFile: 'src-bex/manifest.json
    // },

    // https://v2.quasar.dev/quasar-cli-vite/developing-ssr/configuring-ssr
    ssr: {
      prodPort: 3000, // The default port that the production server should use
                      // (gets superseded if process.env.PORT is specified at runtime)

      middlewares: [
        'render' // keep this as last one
      ],

      // extendPackageJson (json) {},
      // extendSSRWebserverConf (esbuildConf) {},

      // manualStoreSerialization: true,
      // manualStoreSsrContextInjection: true,
      // manualStoreHydration: true,
      // manualPostHydrationTrigger: true,

      pwa: false
      // pwaOfflineHtmlFilename: 'offline.html', // do NOT use index.html as name!

      // pwaExtendGenerateSWOptions (cfg) {},
      // pwaExtendInjectManifestOptions (cfg) {}
    },

    // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
    pwa: {
      workboxMode: 'GenerateSW' // 'GenerateSW' or 'InjectManifest'
      // swFilename: 'sw.js',
      // manifestFilename: 'manifest.json',
      // extendManifestJson (json) {},
      // useCredentialsForManifestTag: true,
      // injectPwaMetaTags: false,
      // extendPWACustomSWConf (esbuildConf) {},
      // extendGenerateSWOptions (cfg) {},
      // extendInjectManifestOptions (cfg) {}
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/configuring-electron
    electron: {
      // extendElectronMainConf (esbuildConf) {},
      // extendElectronPreloadConf (esbuildConf) {},

      extendPackageJson (json) {
        if (ctx.prod) {
          const electronDeps = [
            '@electron/remote',
            'electron',
            'electron-log',
            'electron-updater',
            'fs-extra',
            'get-port',
            'mime-types',
          ]

          const newDependencies: Indexable = {}
          electronDeps.forEach(depName => {
            if (json.dependencies && json.dependencies[depName]) {
              newDependencies[depName] = json.dependencies[depName]
            }
          })

          // Override dependencies use simplified newDependencies
          json.dependencies = newDependencies
        }
      },

      // Electron preload scripts (if any) from /src-electron, WITHOUT file extension
      preloadScripts: [ 'electron-preload' ],

      // specify the debugging port to use for the Electron app when running in development mode
      inspectPort: 5858,

      bundler: 'builder', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration

        appId: 'ai.pileax.desktop',
        productName: 'PileaX',
        mac: {
          target: ['dmg', 'zip'],
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: 'entitlements.mac.plist',
          entitlementsInherit: 'entitlementsInherit.mac.plist',
          signIgnore: [
            'backend/_internal/.*',
            'backend/runnable',
            '_internal/.*',
            'Python.framework/.*'
          ]
        },
        afterSign: 'electron-builder-notarize',
        linux: {
          target: 'AppImage'
        },
        win: {
          target: ['nsis']
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        },
        extraResources: [
          {
            from: '../backend/dist/runnable',
            to: 'backend',
            filter: ["**/*"]
          },
          {
            from: 'src-electron/icons/',
            to: 'icons',
            filter: ["**/*"]
          },
        ]
      }
    },

    // Full list of options: https://v2.quasar.dev/quasar-cli-vite/developing-browser-extensions/configuring-bex
    bex: {
      // extendBexScriptsConf (esbuildConf) {},
      // extendBexManifestJson (json) {},

      /**
       * The list of extra scripts (js/ts) not in your bex manifest that you want to
       * compile and use in your browser extension. Maybe dynamic use them?
       *
       * Each entry in the list should be a relative filename to /src-bex/
       *
       * @example [ 'my-script.ts', 'sub-folder/my-other-script.js' ]
       */
      extraScripts: []
    }
  }
})
