import { useNavigate } from "react-router-dom";
import { useContractContext } from "../context/ContractProvider";
import CampaignCard from "../ui/CampaignCard";

function MyCampaignsPage() {
  const navigate = useNavigate();

  const { campaigns, isLoading, error, address } = useContractContext();

  if (isLoading || error) return <div>Loading...</div>;

  const filteredCampaigns = campaigns.filter((c) => c.owner === address);

  return (
    <>
      <div>
        <p className="font-bold text-2xl pt-4">All campaigns</p>
      </div>
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-wrap h-full gap-8 w-full  ">
          {filteredCampaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} onClick={() => navigate(`/campaign/${c.id}`)} />
          ))}
        </div>
      </div>
    </>
  );
}

export default MyCampaignsPage;
