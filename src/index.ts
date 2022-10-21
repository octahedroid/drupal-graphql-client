import { GraphQLClient } from "graphql-request";
import fetch from "node-fetch";

import { clientCredentialsHeaders, passwordHeaders } from "./authHandlers";
import type { Auth, Config, Options } from "./types";

const calculateAuthHeaders = async <TAuth extends Auth["token_type"]>(
  uri: string,
  type: TAuth,
  options: Options<TAuth>,
  fetcher: Config["fetcher"]
) => {
  if (type === "client_credentials") {
    const { clientId, clientSecret, headerKey } =
      options as Options<"client_credentials">;
    const headers = await clientCredentialsHeaders(
      uri,
      clientId,
      clientSecret,
      fetcher,
      headerKey
    );

    if (headers) {
      return headers;
    }
  }
  if (type === "password") {
    const { username, password, clientId, headerKey } =
      options as Options<"password">;
    const headers = await passwordHeaders(
      uri,
      username,
      password,
      clientId,
      fetcher,
      headerKey
    );

    if (headers) {
      return headers;
    }
  }
  if (type === "token") {
    const { type: tokenType, value, headerKey } = options as Options<"token">;
    const headerKeyName = headerKey ? headerKey : "Authorization";

    return {
      [headerKeyName]: tokenType ? `${tokenType} ${value}` : value,
    };
  }
};

/**
 * Generate a drupal client with the given auth and config
 * @param uri The uri of the drupal site
 * @param auth The auth strategy to use
 * @param options The options for the auth strategy
 * @param config The config for the client
 *
 **/
const drupalGraphqlClient = async <TAuth extends Auth["token_type"]>(
  uri: string,
  type: TAuth,
  options: Options<TAuth>,
  config: Config = {
    fetcher: fetch,
  }
) => {
  const headers = await calculateAuthHeaders(
    uri,
    type,
    options,
    config.fetcher
  );

  if (!headers) {
    throw new Error("Unable to fetch auth headers");
  }

  const client = new GraphQLClient(`${uri}/graphql`, {
    fetch: config.fetcher,
    headers,
  });

  return client;
};

export default drupalGraphqlClient;
