import HomePage from "../pages/main/HomePage";
import { RouteType } from "./config";
import DefaultPage from "../pages/registration/DefaultPage";
import AccountPage from "../pages/account/AccountPage";
import RegistrationPageLayout from "../pages/registration/RegistationPageLayout";
import RegistrationIndex from "../pages/registration/RegistrationIndex";
import CourseRegPage from "../pages/registration/CourseRegPage";
import ClassRegPage from "../pages/registration/ClassRegPage";

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    state: "home"
  },
  {
    path: "/account",
    element: <AccountPage />,
    state: "account",
    sidebarProps: {
      displayText: "Account"
    }
  },
  {
    path: "/registration",
    element: <RegistrationPageLayout />,
    state: "registration",
    sidebarProps: {
      displayText: "Registration"
    },
    child: [
      {
        index: true,
        element: <RegistrationIndex />,
        state: "registration.index"
      },
      {
        path: "/registration/default",
        element: <DefaultPage />,
        state: "registration.default",
        sidebarProps: {
          displayText: "Default"
        },
      },
      {
        path: "/registration/course_registration",
        element: <CourseRegPage />,
        state: "registration.course_registration",
        sidebarProps: {
          displayText: "Course Registration"
        }
      },
      {
        path: "/registration/class_registration",
        element: <ClassRegPage />,
        state: "registration.class_registration",
        sidebarProps: {
          displayText: "Class Registration"
        }
      }
    ]
  }
];

export default appRoutes;