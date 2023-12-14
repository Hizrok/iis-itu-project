import { BrowserRouter, Routes , Route } from "react-router-dom"
import MainLayout from "./components/layout/MainLayout"
import generateRoute from "./routes"
import { useAuthUser, useIsAuthenticated } from "react-auth-kit"
import appRoutes from "./routes/AppRoutes"
import { ConfirmProvider } from "material-ui-confirm"

function App() {

  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();

  return (
    <BrowserRouter>
      <ConfirmProvider>
        <Routes>
          <Route path="/" element={<MainLayout/>}>
            {generateRoute(appRoutes, isAuthenticated(), isAuthenticated()?auth()!.role:"")}
          </Route>
        </Routes>
      </ConfirmProvider>
    </BrowserRouter>
  )
}

export default App
