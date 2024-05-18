import { useNavigate } from "react-router-dom";
import CampaignCard from "../ui/CampaignCard";
import { useContractContext } from "../context/ContractProvider";

function HomePage() {
  const navigate = useNavigate();

  const { campaigns, isLoading, error } = useContractContext();

  if (isLoading || error) return <div>Loading...</div>;

  console.log(campaigns);

  return (
    <>
      <div>
        <p className="font-bold text-2xl pt-4">All campaigns</p>
      </div>
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-wrap h-full gap-8 w-full  ">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} onClick={() => navigate(`/campaign/${c.id}`)} />
          ))}
        </div>
      </div>
    </>
  );
}

export default HomePage;
