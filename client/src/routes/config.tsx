// @author Tomáš Vlach

import { ReactNode } from "react";

// Type for AppRoutes.tsx array of pages

export type RouteType = {
  element: ReactNode,
  state: string,
  authenticated: boolean,
  roles?: string[]
  index?: boolean,
  path?: string,
  child?: RouteType[],
  topbarText?: string,
  sidebarProps?: {
    displayText: string,
    icon?: ReactNode;
  };
};