import HomePage from "../pages/main/HomePage";
import { RouteType } from "./config";

import AccountPage from "../pages/account/AccountPage";

import MainCoursesListPage from "../pages/course/MainCoursesListPage";

import SchedulePage from "../pages/schedule/SchedulePage";

import RegistrationPageLayout from "../pages/registration/RegistationPageLayout";
import RegistrationIndex from "../pages/registration/RegistrationIndex";
import CourseRegPage from "../pages/registration/CourseRegPage";
import ClassRegPage from "../pages/registration/ClassRegPage";

import ListPageLayout from "../pages/list/ListPageLayout";
import ListIndex from "../pages/list/ListIndex";
import CourseListPage from "../pages/list/CourseListPage";
import UserListPage from "../pages/list/UserListPage";
import RoomListPage from "../pages/list/RoomListPage";

import CreatePageLayout from "../pages/create/CreatePageLayout";
import CreateIndex from "../pages/create/CreateIndex";
import UserCreatePage from "../pages/create/UserCreatePage";
import CourseCreatePage from "../pages/create/CourseCreatePage";
import RoomCreatePage from "../pages/create/RoomCreatePage";

import NotFound from "../pages/error/NotFoundPage";
import CourseDetailsPage from "../pages/course/CourseDetailsPage";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    authenticated: false,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "home",
    topbarText: "Registrační stránka"
  },
  {
    path: "/account",
    element: <AccountPage />,
    authenticated: true,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "account",
    topbarText: "Účet"
  },
  {
    path: "/course",
    element: <MainCoursesListPage />,
    authenticated: false,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "course_main_list",
    topbarText: "Seznam předmětů",
    sidebarProps: {
      displayText: "Seznam předmětů"
    }
  },
  {
    path: "/course_details/:courseID",
    element: <CourseDetailsPage />,
    authenticated: false,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "course_details",
    topbarText: "Detail Předmětu",
  },
  {
    path: "/schedule",
    element: <SchedulePage />,
    authenticated: true,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "schedule",
    topbarText: "Rozvrh",
    sidebarProps: {
      displayText: "Rozvrh"
    }
  },
  {
    path: "/registration",
    element: <RegistrationPageLayout />,
    authenticated: true,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "registration",
    topbarText: "Registrace",
    sidebarProps: {
      displayText: "Registace"
    },
    child: [
      {
        index: true,
        element: <RegistrationIndex />,
        authenticated: true,
        roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
        state: "registration.index"
      },
      {
        path: "/registration/course_registration",
        element: <CourseRegPage />,
        authenticated: true,
        roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
        state: "registration.course_registration",
        topbarText: "Registrace předmětů",
        sidebarProps: {
          displayText: "Registrace předmětu"
        }
      },
      {
        path: "/registration/class_registration",
        element: <ClassRegPage />,
        authenticated: true,
        roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
        state: "registration.class_registration",
        topbarText: "Registrace vyučování",
        sidebarProps: {
          displayText: "Registrace vyučování"
        }
      }
    ]
  },
  {
    path: "/list",
    element: <ListPageLayout />,
    authenticated: true,
    roles: ["admin"],
    state: "list",
    topbarText: "Seznamy",
    sidebarProps: {
      displayText: "Seznamy"
    },
    child: [
      {
        index: true,
        element: <ListIndex />,
        authenticated: true,
        roles: ["admin"],
        state: "list.index"
      },
      {
        path: "/list/user_list",
        element: <UserListPage />,
        authenticated: true,
        roles: ["admin"],
        state: "list.user_list",
        topbarText: "Seznam uživetelů",
        sidebarProps: {
          displayText: "Uživatelé"
        }
      },
      {
        path: "/list/course_list",
        element: <CourseListPage />,
        authenticated: true,
        roles: ["admin"],
        state: "list.course_list",
        topbarText: "Seznam předmětů",
        sidebarProps: {
          displayText: "Předmětů"
        }
      },
      {
        path: "/list/room_list",
        element: <RoomListPage />,
        authenticated: true,
        roles: ["admin"],
        state: "list.room_list",
        topbarText: "Seznam místností",
        sidebarProps: {
          displayText: "Místnotí"
        }
      }
    ]
  },
  {
    path: "/create",
    element: <CreatePageLayout />,
    authenticated: true,
    roles: ["admin"],
    state: "create",
    topbarText: "Vytvořit",
    sidebarProps: {
      displayText: "Vytvořit"
    },
    child: [
      {
        index: true,
        element: <CreateIndex />,
        authenticated: true,
        roles: ["admin"],
        state: "create.index"
      },
      {
        path: "/create/user_create",
        element: <UserCreatePage />,
        authenticated: true,
        roles: ["admin"],
        state: "create.user_create",
        topbarText: "Vytvořit uživatele",
        sidebarProps: {
          displayText: "Uživatele"
        }
      },
      {
        path: "/create/course_create",
        element: <CourseCreatePage />,
        authenticated: true,
        roles: ["admin"],
        state: "create.course_create",
        topbarText: "Vytvořit předmět",
        sidebarProps: {
          displayText: "Předmět"
        }
      },
      {
        path: "/create/room_create",
        element: <RoomCreatePage />,
        authenticated: true,
        roles: ["admin"],
        state: "create.room_create",
        topbarText: "Vytvořit místnost",
        sidebarProps: {
          displayText: "Místnost"
        }
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />,
    authenticated: false,
    roles: ["admin", "student"],
    state: "not_found"
  }
];

export default appRoutes;