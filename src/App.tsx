import { Outlet } from "react-router-dom";
import Menu from "./pages/_shared/Menu";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
        <ToastContainer />
        <Menu />
        <Outlet/>
    </div>
  );
}

export default App;