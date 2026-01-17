/**
 * Remote service
 *
 * @version 1.0
 */
import { PUT } from 'src/hooks/useRequest'
import { ChangePassword } from 'src/types/account'

export class AccountSecurityService {
  protected apiName = 'accountSecurity'

  changePassword(body: ChangePassword) {
    return PUT({ name: this.apiName, path: '/password', body })
  }

}

export const accountSecurityService = new AccountSecurityService()
