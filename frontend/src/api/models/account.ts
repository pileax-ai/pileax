export interface AccountModel {
  id: string;
  name: string;
  displayName: string;
  phone?: string;
  roles?: string;
}

export interface LoginParams {
  phone: string;
  password: string;
}

export interface LoginResultModel {
  token: string;
  account: AccountModel;
}
