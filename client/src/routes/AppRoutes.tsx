// @author Tomáš Vlach

import HomePage from "../pages/main/HomePage";
import { RouteType } from "./config";

import AccountPage from "../pages/account/AccountPage";

import MainCoursesListPage from "../pages/course/MainCoursesListPage";
import CourseDetailsPage from "../pages/course/CourseDetailsPage";

import SchedulePage from "../pages/schedule/SchedulePage";

import GuarantiedCourseList from "../pages/garant/GarantCoursePage";

import SchedulerCoursePage from "../pages/scheduler/SchedulerCoursePage";

import RegistrationPageLayout from "../pages/registration/RegistationPageLayout";
import RegistrationIndex from "../pages/registration/RegistrationIndex";
import CourseRegPage from "../pages/registration/CourseRegPage";
import ClassRegPage from "../pages/registration/ClassRegPage";

import ListPageLayout from "../pages/list/ListPageLayout";
import ListIndex from "../pages/list/ListIndex";
import CourseListPage from "../pages/list/CourseList/CourseListPage";
import RoomListPage from "../pages/list/RoomList/RoomListPage";
import RegistrationListPage from "../pages/list/RegistrationListPage";

import NotFound from "../pages/error/NotFoundPage";
import UserListPage from "../pages/list/UserList/UserListPage";

// A list of all pages on the website for route and navigation generation
// All pages need an element that will be loaded when the page changes to it, a valid path to it, and state+authentification information

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
    path: "/courses",
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
    path: "/courses/:courseID",
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
    roles: ["student"],
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
    path: "/guarantied",
    element: <GuarantiedCourseList />,
    authenticated: true,
    roles: ["admin", "garant"],
    state: "guarantied",
    topbarText: "Garantované předmety",
    sidebarProps: {
      displayText: "Garantované předmety",
    },
  },
  {
    path: "/scheduler",
    element: <SchedulerCoursePage />,
    authenticated: true,
    roles: ["admin", "rozvrhář"],
    state: "scheduler",
    topbarText: "Tvorba rozvrhu",
    sidebarProps: {
      displayText: "Tvorba rozvrhu",
    },
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
        path: "/list/registrations",
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
      // {
      //   path: "/list/activity_list",
      //   element: <ActivityListPage />,
      //   authenticated: true,
      //   roles: ["admin", "garant"],
      //   state: "list.activity_list",
      //   topbarText: "Seznam aktivit",
      //   sidebarProps: {
      //     displayText: "Aktivit",
      //   },
      // },
      // {
      //   path: "/list/instance_list",
      //   element: <InstanceListPage />,
      //   authenticated: true,
      //   roles: ["admin"],
      //   state: "list.instance_list",
      //   topbarText: "Seznam instancí",
      //   sidebarProps: {
      //     displayText: "Instancí",
      //   },
      // },
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
