import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import CourseList from "../../components/lists/courseListComponent";
import { useAuthHeader, useAuthUser, useIsAuthenticated } from "react-auth-kit";
import Filter from "../../components/common/Filters/filter";
import "../../styles/style.css";
import ScheduleIcon from "../../assets/scheduleIcon.png";
import ListIcon from "../../assets/listIcon.png";
import Tile from "../../components/common/Tiles/Tile";

type Course = {
  id: string;
  name: string;
  guarantor: string;
};

const HomePage = () => {
  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const authHeader = useAuthHeader();
  const dispatch = useDispatch();

  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);

  useEffect(() => {
    getCourses();
  }, [isAuthenticated()]);

  const getCourses = () => {
    if (isAuthenticated()) {
      if (auth()!.role === "student") {
        fetchCoursesStudent();
        //fetchActivitiesStudent():
      } else if (auth()!.role === "vyučující") {
        fetchCoursesTeacher();
        //fetchActivitiesTeacher():
      } else if (auth()!.role === "garant") {
        fetchCoursesGarant();
        //fetchActivitiesGarant():
      }
    }
  };

  const sortCourses = (
    courses: Course[],
    sortBy: string,
    descending: boolean
  ) => {
    return courses.slice().sort((a: any, b: any) => {
      const order = descending ? -1 : 1;
      return a[sortBy].localeCompare(b[sortBy]) * order;
    });
  };

  const filterCourses = (filterType: string, isDescending: boolean) => {
    setFilteredCourses(sortCourses(courses, filterType, isDescending));
  };

  async function fetchCourses(URL: string) {
    dispatch(setLoadingContentState(true));
    try {
      const response = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: authHeader(),
        },
      });
      const json_courses = await response.json();

      setFilteredCourses(json_courses);
      setCourses(json_courses);
      dispatch(setLoadingContentState(false));
    } catch (err) {
      console.log(err);
      dispatch(setLoadingContentState(false));
    }
  }

  async function fetchCoursesStudent() {
    fetchCourses(
      import.meta.env.VITE_SERVER_HOST + "registrations/courses/" + auth()!.id
    );
  }

  async function fetchCoursesTeacher() {
    fetchCourses(
      import.meta.env.VITE_SERVER_HOST + "instances?lecturer=" + auth()!.id
    );
  }

  async function fetchCoursesGarant() {
    fetchCourses(
      import.meta.env.VITE_SERVER_HOST + "instances?lecturer=" + auth()!.id
    );
  }

  type ReturnPageProps = {
    headerName: string;
    errorMessage: string;
  };

  const ReturnPage = (props: ReturnPageProps) => {
    if (courses.length !== 0) {
      return (
        <div className="course-page">
          <div className="list-pages-list-container">
            <h2>{props.headerName}</h2>
          </div>
          <Filter onFilterChange={filterCourses} />
          <CourseList courses={filteredCourses} />
        </div>
      );
    } else {
      return (
        <div className="course-page">
          <div className="list-pages-list-container">
            <h2>{props.headerName}</h2>
          </div>
          {props.errorMessage}
        </div>
      );
    }
  };

  const AdminPage = () => {
    return (
      <div className="course-page">
        <div className="list-pages-list-container">
          <h2>Přihlášený jako admin</h2>
        </div>
        <h3>Správa stránek</h3>
        <p>
          Pro tvorbu, mazání a úpravu uživatelů, předmětů, místnotí aktivit se
          referujete v navigaci do sekce <code>Vytvořit</code>
        </p>
        <p>
          Ve stejné sekci je možno v položce Registrace vytvořit a ovládat
          nynější registrační okno
        </p>

        <h3>Ovládání registrací</h3>
        <p>
          Registrace se dějí v několika fázích mezi kterými se dá přepínat. Tyto
          fáze jsou Idle, CoursesInProgress, Scheduling, ActivitiesInProgress,
          Finished. V každém stavu uživatelé mohou pouze upravovat informace
          odpovídající stavu. V jednu chvíli může být pouze jedna aktivní
          registrace.
        </p>
        <p>
          Pro vytvoření registrace stačí kliknout na tlačitko Přidat Novou
          Registraci.
        </p>
        <p>
          Pro přesunutí registrace do další fáze registrace stačí kliknout na
          tlačítko Další Fáze.
        </p>
        <p>
          Pro zrušení nebo resetování registrace do původního stavu stačí
          kliknout jejich respektivní tlačítka.
        </p>
      </div>
    );
  };

  if (isAuthenticated()) {
    if (auth()!.role === "student") {
      return (
        <div>
          {/* <ReturnPage
            headerName="Seznam Registrovaných Předmětů"
            errorMessage="Žádné předměty nejsou registrovány"
          /> */}
          <div className="tileWrapper">
            <Tile title="Rozvrh" icon={ScheduleIcon} url="/schedule" />
            <Tile title="Seznam předmětů" icon={ListIcon} url="/courses" />
          </div>
        </div>
      );
    } else if (auth()!.role === "vyučující") {
      return (
        <ReturnPage
          headerName="Seznam Vyučovaných Předmětů"
          errorMessage="Nevyučujete žádné předměty"
        />
      );
    } else if (auth()!.role === "garant") {
      return (
        <ReturnPage
          headerName="Seznam Garantovaných Předmětů"
          errorMessage="Negarantujete žádné předměty"
        />
      );
    } else if (auth()!.role === "admin") {
      return <AdminPage />;
    } else {
      return <></>;
    }
  } else {
    return <></>;
  }
};

export default HomePage;
