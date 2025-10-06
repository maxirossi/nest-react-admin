import { ComponentType, useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { AuthenticationContext } from './context/AuthenticationContext';

export { Route } from 'react-router-dom';

interface PrivateRouteProps {
  component: ComponentType<any>;
  roles?: string[];
  exact?: boolean;
  path: string;
}

export function PrivateRoute({
  component: Component,
  roles,
  ...rest
}: PrivateRouteProps) {
  const { authenticatedUser } = useContext(AuthenticationContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (authenticatedUser) {
          if (roles) {
            if (roles.includes(authenticatedUser.role)) {
              return <Component {...props} />;
            } else {
              return <Redirect to="/" />;
            }
          } else {
            return <Component {...props} />;
          }
        }
        return <Redirect to="/login" />;
      }}
    />
  );
}

interface AuthRouteProps {
  component: ComponentType<any>;
  exact?: boolean;
  path: string;
}

export function AuthRoute({ component: Component, ...rest }: AuthRouteProps) {
  const { authenticatedUser } = useContext(AuthenticationContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        return authenticatedUser ? (
          <Redirect to="/" />
        ) : (
          <Component {...props} />
        );
      }}
    />
  );
}
