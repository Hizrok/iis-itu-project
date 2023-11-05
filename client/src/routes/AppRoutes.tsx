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

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    state: "home"
  },
  {
    path: "/account",
    element: <AccountPage />,
    state: "account"
  },
  {
    path: "/course",
    element: <MainCoursesListPage />,
    state: "course_main_list",
    sidebarProps: {
      displayText: "Seznam předmětů"
    }
  },
  {
    path: "/schedule",
    element: <SchedulePage />,
    state: "schedule",
    sidebarProps: {
      displayText: "Rozvrh"
    }
  },
  {
    path: "/registration",
    element: <RegistrationPageLayout />,
    state: "registration",
    sidebarProps: {
      displayText: "Registace"
    },
    child: [
      {
        index: true,
        element: <RegistrationIndex />,
        state: "registration.index"
      },
      {
        path: "/registration/course_registration",
        element: <CourseRegPage />,
        state: "registration.course_registration",
        sidebarProps: {
          displayText: "Registrace předmětu"
        }
      },
      {
        path: "/registration/class_registration",
        element: <ClassRegPage />,
        state: "registration.class_registration",
        sidebarProps: {
          displayText: "Registrace vyučování"
        }
      }
    ]
  },
  {
    path: "/list",
    element: <ListPageLayout />,
    state: "list",
    sidebarProps: {
      displayText: "Seznamy"
    },
    child: [
      {
        index: true,
        element: <ListIndex />,
        state: "list.index"
      },
      {
        path: "/list/user_list",
        element: <UserListPage />,
        state: "list.user_list",
        sidebarProps: {
          displayText: "Uživatelé"
        }
      },
      {
        path: "/list/course_list",
        element: <CourseListPage />,
        state: "list.course_list",
        sidebarProps: {
          displayText: "Předmětů"
        }
      },
      {
        path: "/list/room_list",
        element: <RoomListPage />,
        state: "list.room_list",
        sidebarProps: {
          displayText: "Místnotí"
        }
      }
    ]
  },
  {
    path: "/create",
    element: <CreatePageLayout />,
    state: "create",
    sidebarProps: {
      displayText: "Vytvořit"
    },
    child: [
      {
        index: true,
        element: <CreateIndex />,
        state: "create.index"
      },
      {
        path: "/create/user_create",
        element: <UserCreatePage />,
        state: "create.user_create",
        sidebarProps: {
          displayText: "Uživatele"
        }
      },
      {
        path: "/create/course_create",
        element: <CourseCreatePage />,
        state: "create.course_create",
        sidebarProps: {
          displayText: "Předmět"
        }
      },
      {
        path: "/create/room_create",
        element: <RoomCreatePage />,
        state: "create.room_create",
        sidebarProps: {
          displayText: "Místnost"
        }
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />,
    state: "not_found"
  }
];

export default appRoutes;