// @author Tomáš Vlach

import { ReactNode } from "react";
import { Route } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import { RouteType } from "./config";

// Generates all routes in the website base on the users login role

const generateRoute = (routes: RouteType[], auth: boolean, role: string): ReactNode => {

  return routes.map((route, index) => (
    route.authenticated?
      auth?
        route.roles?.includes(role)?
          route.index ? (
            <Route
              index
              path={route.path}
              element={<PageWrapper state={route.state}>
                {route.element}
              </PageWrapper>}
              key={index}
            />
          ) : (
            <Route
              path={route.path}
              element={
                <PageWrapper state={route.child ? undefined : route.state}>
                  {route.element}
                </PageWrapper>
              }
              key={index}
            >
              {route.child && (
                generateRoute(route.child, auth, role)
              )}
            </Route>
          )
        : null
      : null
    :
    route.index ? (
      <Route
        index
        path={route.path}
        element={<PageWrapper state={route.state}>
          {route.element}
        </PageWrapper>}
        key={index}
      />
    ) : (
      <Route
        path={route.path}
        element={
          <PageWrapper state={route.child ? undefined : route.state}>
            {route.element}
          </PageWrapper>
        }
        key={index}
      >
        {route.child && (
          generateRoute(route.child, auth, role)
        )}
      </Route>
    )
  ));
};

export default generateRoute;