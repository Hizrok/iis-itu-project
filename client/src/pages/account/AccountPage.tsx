import { useAuthUser, useIsAuthenticated } from "react-auth-kit";

const AccountPage = () => {

    const auth = useAuthUser();
    const isAuthenticated = useIsAuthenticated();

    if(isAuthenticated()){
        return(
            <div>{auth()!.login}</div>
            )
        }
    return(
        <div>Not logged in!</div>
    )
}

export default AccountPage;