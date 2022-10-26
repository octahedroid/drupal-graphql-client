type OptionsShared = {
  headerKey?: string;
};

type ClientOptions = OptionsShared & {
  clientId: string;
  clientSecret: string;
};

type ClientCredentialsOAuth = {
  token_type: "client_credentials";
  options: ClientOptions;
};

type PasswordOAuth = {
  token_type: "password";
  options: {
    username: string;
    password: string;
  } & ClientOptions;
};

type TokenAuth = {
  token_type: "token";
  options: {
    type?: string;
    value: string;
  } & OptionsShared;
};

export type Auth = ClientCredentialsOAuth | PasswordOAuth | TokenAuth;

export type Options<TConfig extends Auth["token_type"]> = Extract<
  Auth,
  { token_type: TConfig }
>["options"];

export type Config = {
  fetcher: any;
};

export interface OAuthPayload {
  access_token: string;
  token_type: string;
}
