import axios from "axios";
import { Guarantor } from "../common/Types/Course";

export const getUsers = async (
    setLoading: Function,
    setUsers: Function,
    authHeader: Function,
) => {
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}users`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };

  export const getGuarantors = async (
    setLoading: Function,
    setGuarantors: Function,
    authHeader: Function,
) => {
    setLoading(true);
    await axios
      .get(`${import.meta.env.VITE_SERVER_HOST}users/guarantors`, {
        headers: {
          Authorization: authHeader(),
        },
      })
      .then((res) => {
        setGuarantors(res.data.map((g: Guarantor) => g.id));
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
      });
  };
