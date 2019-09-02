import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "./react-auth0-wrapper";
import config from "./auth_config.json";
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import createAuth0Client from "@auth0/auth0-spa-js";


// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

createAuth0Client({
  domain: config.domain,
  client_id: config.clientId,
  redirect_uri: window.location.origin,
  audience: config.audience,
})
.then(auth0Client => {
  const client = new ApolloClient({
    uri: 'http://localhost:4000',
    request: async operation => {
      const token = await auth0Client.getTokenSilently()
      return operation.setContext(context => ({
        headers: {
          ...context.headers,
          Authorization: `Bearer ${token}`,
        },
      }));
    },
  });

  ReactDOM.render(
    <Auth0Provider
      client={auth0Client}
      onRedirectCallback={onRedirectCallback}
  >
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Auth0Provider>,
    document.getElementById("root")
  );
})

serviceWorker.unregister();
