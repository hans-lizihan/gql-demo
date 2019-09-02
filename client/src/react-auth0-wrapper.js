import React, { useState, useEffect, useContext } from "react";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  client,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {

      if (window.location.search.includes("code=")) {
        const { appState } = await client.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await client.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await client.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
  }, [client, onRedirectCallback]);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await client.handleRedirectCallback();
    const user = await client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };
  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p) => client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => client.loginWithRedirect(...p),
        getTokenSilently: (...p) => client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => client.getTokenWithPopup(...p),
        logout: (...p) => client.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
