import { Outlet } from "react-router-dom";
import Menu from "./pages/_shared/Menu";

function App() {
  return (
    <div className="App">
        <Menu />
        <Outlet/>
    </div>
  );
}

export default App;