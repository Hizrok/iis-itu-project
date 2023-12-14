import { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

import "./styles.css";
import { Button, CircularProgress } from "@mui/material";

type Registration = {
  id: number;
  state: number;
  status: boolean;
};

const getStateDescription = (state: number) => {
  switch (state) {
    case 0:
      return "IDLE";
    case 1:
      return "COURSE REGISTRATION IN PROGRESS";
    case 2:
      return "EVALUATING COURSE REGISTRATION";
    case 3:
      return "SCHEDULING";
    case 4:
      return "INSTANCE REGISTRATION IN PROGRESS";
    case 5:
      return "EVALUATING INSTANCE REGISTRATION";
    default:
      return "FINISHED";
  }
};

const RegistrationListPage = () => {
  const authHeader = useAuthHeader();

  const [loading, setLoading] = useState(false);

  const [index, setIndex] = useState(0);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const getRegistrations = async () => {
    setLoading(true);
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}registrations`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setRegistrations(res.data);
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].status) {
            setIndex(i);
            break;
          }
        }
      })
      .catch((err) => console.error(err.message))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    axios
      .post(
        `${import.meta.env.VITE_SERVER_HOST}registrations`,
        {},
        { headers: { Authorization: authHeader() } }
      )
      .then((res) => {
        setRegistrations((oldRegistrations) => {
          const newRegistrations = [...oldRegistrations];
          newRegistrations.push({ id: res.data.id, state: 0, status: false });
          return newRegistrations;
        });
      })
      .catch((err) => console.error(err.message));
  };

  const handleSetActive = (id: number, i: number) => {
    axios
      .put(
        `${import.meta.env.VITE_SERVER_HOST}registrations/${id}`,
        {},
        { headers: { Authorization: authHeader() } }
      )
      .then((res) => {
        console.log(res.data.msg);
        setRegistrations((oldRegistrations) => {
          const newRegistrations = [...oldRegistrations];
          newRegistrations[index].status = false;
          newRegistrations[i].status = true;
          setIndex(i);
          return newRegistrations;
        });
      })
      .catch((err) => console.error(err.message));
  };

  const handleReset = (id: number, i: number) => {
    axios
      .put(
        `${import.meta.env.VITE_SERVER_HOST}registrations/reset/${id}`,
        {},
        { headers: { Authorization: authHeader() } }
      )
      .then((res) => {
        console.log(res.data.msg);
        setRegistrations((oldRegistrations) => {
          const newRegistrations = [...oldRegistrations];
          newRegistrations[i].state = 0;
          return newRegistrations;
        });
      })
      .catch((err) => console.error(err.message));
  };

  const handleNext = (id: number, i: number) => {
    axios
      .put(
        `${import.meta.env.VITE_SERVER_HOST}registrations/next/${id}`,
        {},
        { headers: { Authorization: authHeader() } }
      )
      .then((res) => {
        console.log(res.data.msg);
        setRegistrations((oldRegistrations) => {
          const newRegistrations = [...oldRegistrations];
          newRegistrations[i].state++;
          return newRegistrations;
        });
      })
      .catch((err) => console.error(err.message));
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`${import.meta.env.VITE_SERVER_HOST}registrations/${id}`, {
        headers: { Authorization: authHeader() },
      })
      .then((res) => {
        console.log(res.data.msg);
        setRegistrations(
          registrations.filter((reg: Registration) => reg.id !== id)
        );
      })
      .catch((err) => console.error(err.message));
  };

  useEffect(() => {
    getRegistrations();
  }, []);

  return (
    <div>
      <h2>Seznam registrací</h2>
      <Button variant="contained" onClick={handleAdd}>
        create registration
      </Button>
      <div className="list reg-list-container">
        <div className="list-header registration-list ">
          <span>status</span>
          <span>id</span>
          <span>state</span>
          <span>next phase</span>
          <span>set active</span>
          <span>reset</span>
          <span>delete</span>
        </div>
        {loading ? (
          <div className="loader-container">
            <CircularProgress color="inherit" />
          </div>
        ) : (
          registrations.map((reg: Registration, i) => (
            <div className="list-item registration-list" key={i}>
              <div className="status-container">
                <div className={`status ${reg.status && "active"}`}></div>
              </div>
              <span>{reg.id}</span>
              <span>{getStateDescription(reg.state)}</span>
              <Button
                disabled={reg.state === 6}
                onClick={() => handleNext(reg.id, i)}
              >
                next
              </Button>
              <Button
                disabled={reg.status}
                onClick={() => handleSetActive(reg.id, i)}
              >
                set
              </Button>
              <Button
                disabled={reg.state === 0}
                onClick={() => handleReset(reg.id, i)}
              >
                reset
              </Button>
              <Button onClick={() => handleDelete(reg.id)}>delete</Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RegistrationListPage;
