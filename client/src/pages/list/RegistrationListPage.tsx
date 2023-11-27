import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuthHeader } from "react-auth-kit";
import { setLoadingContentState } from "../../redux/features/LoadingContentStateSlice";
import { Box, Button } from "@mui/material";

type Registration = {
  id: number;
  state: string;
  status: string;
};

const RegistrationListPage = () => {
  const dispatch = useDispatch();
  const authHeader = useAuthHeader();

  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        dispatch(setLoadingContentState(true));
        const response = await fetch(
          import.meta.env.VITE_SERVER_HOST + "registrations",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
          }
        );
        const json = await response.json();

        setRegistrations(json);

        dispatch(setLoadingContentState(false));
      } catch (error) {
        dispatch(setLoadingContentState(false));
        console.error("Error fetching users:", error);
      }
    }

    fetchRegistrations();
  }, []);

  const handleSetActive = (id: number) => {
    async function setActive(id: number) {
      try {
        dispatch(setLoadingContentState(true));
        await fetch(import.meta.env.VITE_SERVER_HOST + `registrations/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: authHeader(),
          },
          body: JSON.stringify({
            status: "ACTIVE",
          }),
        });

        const response = await fetch(
          import.meta.env.VITE_SERVER_HOST + "registrations",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
          }
        );
        const json = await response.json();

        setRegistrations(json);

        dispatch(setLoadingContentState(false));
      } catch (error) {
        dispatch(setLoadingContentState(false));
        console.error("Error fetching users:", error);
      }
    }

    setActive(id);
  };

  const handleReset = (id: number) => {
    async function reset(id: number) {
      try {
        dispatch(setLoadingContentState(true));
        await fetch(
          import.meta.env.VITE_SERVER_HOST + `registrations/reset/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
            body: JSON.stringify({
              status: "ACTIVE",
            }),
          }
        );

        const response = await fetch(
          import.meta.env.VITE_SERVER_HOST + "registrations",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
          }
        );
        const json = await response.json();

        setRegistrations(json);

        dispatch(setLoadingContentState(false));
      } catch (error) {
        dispatch(setLoadingContentState(false));
        console.error("Error fetching users:", error);
      }
    }

    reset(id);
  };

  const handleAdd = () => {
    async function add() {
      try {
        dispatch(setLoadingContentState(true));
        await fetch(import.meta.env.VITE_SERVER_HOST + `registrations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: authHeader(),
          },
        });

        const response = await fetch(
          import.meta.env.VITE_SERVER_HOST + "registrations",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
          }
        );
        const json = await response.json();

        setRegistrations(json);

        dispatch(setLoadingContentState(false));
      } catch (error) {
        dispatch(setLoadingContentState(false));
        console.error("Error fetching users:", error);
      }
    }

    add();
  };

  const handleDelete = (id: number) => {
    async function send_delete(id: number) {
      try {
        dispatch(setLoadingContentState(true));
        await fetch(import.meta.env.VITE_SERVER_HOST + `registrations/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: authHeader(),
          },
        });

        setRegistrations(
          registrations.filter((reg: Registration) => {
            return reg.id !== id;
          })
        );

        dispatch(setLoadingContentState(false));
      } catch (error) {
        dispatch(setLoadingContentState(false));
        console.error("Error fetching users:", error);
      }
    }

    send_delete(id);
  };

  const handleNext = (id: number, state: string) => {
    async function next_phase(id: number, state: string) {
      try {
        dispatch(setLoadingContentState(true));

        let query = "";
        let body;

        if (state === "IDLE") {
          query = "start";
          body = JSON.stringify({
            type: "COURSES",
          });
        } else if (state === "COURSES IN PROGRESS") {
          query = "stop";
          body = JSON.stringify({
            type: "COURSES",
          });
        } else if (state === "SCHEDULING") {
          query = "start";
          body = JSON.stringify({
            type: "INSTANCES",
          });
        } else if (state === "ACTIVITIES IN PROGRESS") {
          query = "stop";
          body = JSON.stringify({
            type: "INSTANCES",
          });
        }

        await fetch(
          import.meta.env.VITE_SERVER_HOST + `registrations/${query}/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
            body,
          }
        );

        const response = await fetch(
          import.meta.env.VITE_SERVER_HOST + "registrations",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: authHeader(),
            },
          }
        );
        const json = await response.json();

        setRegistrations(json);

        dispatch(setLoadingContentState(false));
      } catch (error) {
        dispatch(setLoadingContentState(false));
        console.error("Error fetching users:", error);
      }
    }

    next_phase(id, state);
  };

  return (
    <div className="users-page">
      <div className="list-pages-list-container">
        <h2>Seznam Registrací</h2>
        <Button onClick={handleAdd}>přidat novou registraci</Button>
        <ul>
          {registrations
            .sort((a: Registration, b: Registration) => a.id - b.id)
            .map((reg: Registration) => (
              <Box
                key={reg.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "50px 1fr 100px 200px 100px 100px",
                  height: "70px",
                  width: "900px",
                  alignItems: "center",
                }}
              >
                <span className="list-item-property">{reg.id}</span>
                <span className="list-item-property">{reg.state}</span>
                <Button
                  disabled={reg.status !== "ACTIVE"}
                  onClick={() => handleNext(reg.id, reg.state)}
                >
                  další fáze
                </Button>
                {reg.status !== "ACTIVE" ? (
                  <Button onClick={() => handleSetActive(reg.id)}>
                    nastavit jako aktivní
                  </Button>
                ) : (
                  <span style={{ textAlign: "center" }}>ACTIVE</span>
                )}
                <Button onClick={() => handleReset(reg.id)}>reset</Button>
                <Button onClick={() => handleDelete(reg.id)}>odstranit</Button>
              </Box>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default RegistrationListPage;
