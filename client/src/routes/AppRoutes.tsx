import HomePage from "../pages/main/HomePage";
import { RouteType } from "./config";

import AccountPage from "../pages/account/AccountPage";

import MainCoursesListPage from "../pages/course/MainCoursesListPage";
import CourseDetailsPage from "../pages/course/CourseDetailsPage";

import SchedulePage from "../pages/schedule/SchedulePage";

import RegistrationPageLayout from "../pages/registration/RegistationPageLayout";
import RegistrationIndex from "../pages/registration/RegistrationIndex";
import CourseRegPage from "../pages/registration/CourseRegPage";
import ClassRegPage from "../pages/registration/ClassRegPage";

import ListPageLayout from "../pages/list/ListPageLayout";
import ListIndex from "../pages/list/ListIndex";
import CourseListPage from "../pages/list/CourseList/CourseListPage";
import UserListPage from "../pages/list/UserList/UserListPage";
import RoomListPage from "../pages/list/RoomList/RoomListPage";
import ActivityListPage from "../pages/list/ActivityListPage";
import RegistrationListPage from "../pages/list/RegistrationListPage";

import NotFound from "../pages/error/NotFoundPage";
import InstanceListPage from "../pages/list/InstanceListPage";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    authenticated: false,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "home",
    topbarText: "Registrační stránka",
  },
  {
    path: "/account",
    element: <AccountPage />,
    authenticated: true,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "account",
    topbarText: "Účet",
  },
  {
    path: "/course",
    element: <MainCoursesListPage />,
    authenticated: false,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "main",
    topbarText: "Seznam předmětů",
    sidebarProps: {
      displayText: "Seznam předmětů",
    },
  },
  {
    path: "/course_details/:courseID",
    element: <CourseDetailsPage />,
    authenticated: false,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "course_details",
    topbarText: "Detaily Předmětu",
  },
  {
    path: "/schedule",
    element: <SchedulePage />,
    authenticated: true,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "schedule",
    topbarText: "Rozvrh",
    sidebarProps: {
      displayText: "Rozvrh",
    },
  },
  {
    path: "/registration",
    element: <RegistrationPageLayout />,
    authenticated: true,
    roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
    state: "registration",
    topbarText: "Registrace",
    sidebarProps: {
      displayText: "Registace",
    },
    child: [
      {
        index: true,
        element: <RegistrationIndex />,
        authenticated: true,
        roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
        state: "registration.index",
      },
      {
        path: "/registration/course_registration",
        element: <CourseRegPage />,
        authenticated: true,
        roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
        state: "registration.course_registration",
        topbarText: "Registrace předmětů",
        sidebarProps: {
          displayText: "Registrace předmětu",
        },
      },
      {
        path: "/registration/class_registration",
        element: <ClassRegPage />,
        authenticated: true,
        roles: ["admin", "student", "vyučující", "rozvrhář", "garant"],
        state: "registration.class_registration",
        topbarText: "Registrace vyučování",
        sidebarProps: {
          displayText: "Registrace vyučování",
        },
      },
    ],
  },
  {
    path: "/list",
    element: <ListPageLayout />,
    authenticated: true,
    roles: ["admin"],
    state: "list",
    topbarText: "Seznamy",
    sidebarProps: {
      displayText: "Seznamy",
    },
    child: [
      {
        index: true,
        element: <ListIndex />,
        authenticated: true,
        roles: ["admin"],
        state: "list.index",
      },
      {
        path: "/list/registration_list",
        element: <RegistrationListPage />,
        authenticated: true,
        roles: ["admin"],
        state: "list.registration_list",
        topbarText: "Seznam registrací",
        sidebarProps: {
          displayText: "Registrace",
        },
      },
      {
        path: "/list/users",
        element: <UserListPage />,
        authenticated: true,
        roles: ["admin"],
        state: "list.user_list",
        topbarText: "Seznam uživetelů",
        sidebarProps: {
          displayText: "Uživatelé",
        },
      },
      {
        path: "/list/courses",
        element: <CourseListPage />,
        authenticated: true,
        roles: ["admin", "garant"],
        state: "list.course_list",
        topbarText: "Seznam předmětů",
        sidebarProps: {
          displayText: "Předmětů",
        },
      },
      {
        path: "/list/rooms",
        element: <RoomListPage />,
        authenticated: true,
        roles: ["admin"],
        state: "list.room_list",
        topbarText: "Seznam místností",
        sidebarProps: {
          displayText: "Místnotí",
        },
      },
      {
        path: "/list/activity_list",
        element: <ActivityListPage />,
        authenticated: true,
        roles: ["admin", "garant"],
        state: "list.activity_list",
        topbarText: "Seznam aktivit",
        sidebarProps: {
          displayText: "Aktivit",
        },
      },
      {
        path: "/list/instance_list",
        element: <InstanceListPage />,
        authenticated: true,
        roles: ["admin"],
        state: "list.instance_list",
        topbarText: "Seznam instancí",
        sidebarProps: {
          displayText: "Instancí",
        },
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
    authenticated: false,
    roles: ["admin", "student"],
    state: "not_found",
  },
];

export default appRoutes;
