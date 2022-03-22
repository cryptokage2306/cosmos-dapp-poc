import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { ToastContainer } from "react-toastify";
import {
  ALL_NFT_PAGE,
  MULTI_SEND,
  MULTI_SEND_BASE_PAGE,
  NFT_BASE_PAGE,
  NFT_BINDING,
  NFT_WRITE_PAGE,
  SEND_BASE_PAGE,
  SHOW_ALL_NFT,
} from "./constant";
import { MultiSend } from "./pages/MultiSend";
import { Send } from "./pages/Send";
import "react-toastify/dist/ReactToastify.css";
import { AllNFTsList } from "./pages/AllNFTsList";
import { Cosmwasm } from "./pages/Cosmwasm";
import { Write } from "./pages/Cosmwasm/Write";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="p-3">
        <Routes>
          {MULTI_SEND && (
            <Route path={MULTI_SEND_BASE_PAGE} element={<MultiSend />} />
          )}
          {MULTI_SEND && <Route path={SEND_BASE_PAGE} element={<Send />} />}
          {NFT_BINDING && <Route path={NFT_BASE_PAGE} element={<Cosmwasm />} />}
          {NFT_BINDING && <Route path={NFT_WRITE_PAGE} element={<Write />} />}

          {SHOW_ALL_NFT && (
            <Route path={ALL_NFT_PAGE} element={<AllNFTsList />} />
          )}
        </Routes>
      </div>
      <div className="footer">
        <p>Copyright of Cudos</p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
