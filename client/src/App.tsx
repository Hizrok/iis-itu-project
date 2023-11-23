import { BrowserRouter, Routes , Route } from "react-router-dom"
import MainLayout from "./components/layout/MainLayout"
import generateRoute from "./routes"
import { useAuthUser, useIsAuthenticated } from "react-auth-kit"
import appRoutes from "./routes/AppRoutes"

function App() {

  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          {generateRoute(appRoutes, isAuthenticated(), isAuthenticated()?auth()!.role:"")}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
