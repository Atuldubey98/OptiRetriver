import { Route, Routes } from "react-router-dom";
import Appbar from "./features/common/Appbar";
import HomePage from "./features/home";

export default function App() {
  return (
    <>
      <Appbar/>
      <Routes>
        <Route index element={<HomePage />} />
      </Routes>
    </>
  );
}
