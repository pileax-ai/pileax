import { boot } from 'quasar/wrappers'
import { hasPermission } from 'src/directives/permission'

export default boot(({ app }) => {
  app.directive('permission', hasPermission)
})
