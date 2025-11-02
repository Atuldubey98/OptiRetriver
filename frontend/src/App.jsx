import { Route, Routes } from "react-router-dom";
import HomePage from "./features/home";
import Appbar from "./features/common/Appbar";
import useDisclosure from "./hooks/useDisclosure";
import Sidedrawer from "./features/common/Sidedrawer";

export default function App() {
  const { open, onClose, onOpen } = useDisclosure({ defaultOpen: false });
  return (
    <>
      <Appbar onClickMenu={onOpen} />
      <Sidedrawer onClose={onClose} open={open} />
      <Routes>
        <Route index element={<HomePage />} />
      </Routes>
    </>
  );
}
