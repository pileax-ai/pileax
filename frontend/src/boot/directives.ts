import { boot } from 'quasar/wrappers'
import { hasPermission } from 'src/directives/permission'

export default boot(({ app }) => {
  console.log('directives')
  app.directive('permission', hasPermission)
})
