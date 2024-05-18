import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import HomePage from "./pages/HomePage";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignDetails from "./pages/CampaignDetails";
import ContractProvider from "./context/ContractProvider";
import WalletPage from "./pages/WalletPage";

function App() {
  return (
    <ContractProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate replace to="home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/createCampaign" element={<CreateCampaign />} />
            <Route path="/campaign/:campaignId" element={<CampaignDetails />} />
            <Route path="/tokenWallet" element={<WalletPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContractProvider>
  );
}

export default App;
