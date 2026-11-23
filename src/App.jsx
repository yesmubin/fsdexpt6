import { useAuth } from "./AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Dashboard /> : <Login />;
}

export default App;