import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import HomePage from "./pages/HomePage";
import CreateCampaign from "./pages/CreateCampaign";
import CampaignDetails from "./pages/CampaignDetails";
import ContractProvider from "./context/ContractProvider";
import WalletPage from "./pages/WalletPage";
import MarketplacePage from "./pages/MarketplacePage";
import MyCampaignsPage from "./pages/MyCampaignsPage";
import MarketplaceProvider from "./context/MarketplaceProvider";

function App() {
  return (
    <ContractProvider>
      <MarketplaceProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate replace to="home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/myCampaigns" element={<MyCampaignsPage />} />
              <Route path="/createCampaign" element={<CreateCampaign />} />
              <Route path="/campaign/:campaignId" element={<CampaignDetails />} />
              <Route path="/tokenWallet" element={<WalletPage />} />
              <Route path="/tokenMarketplace" element={<MarketplacePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MarketplaceProvider>
    </ContractProvider>
  );
}

export default App;
