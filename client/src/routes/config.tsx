import { ReactNode } from "react";

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