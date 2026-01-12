export interface AccountModel {
  id: string;
  name: string;
  displayName: string;
  phone?: string;
  roles?: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResultModel {
  token: string;
  account: AccountModel;
}
