import { useContractRead } from "@thirdweb-dev/react";
import { useContractContext } from "../context/ContractProvider";

// eslint-disable-next-line react/prop-types
function Token({ campaignId }) {
  const { contract, address, getCampaign } = useContractContext();
  const { data, isLoading, error } = useContractRead(contract, "checkTokenBalance", [
    campaignId,
    address,
  ]);
  const campaign = getCampaign(campaignId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  console.log(data);

  if (Number(data._hex) === 0) return null;

  return (
    <div className="flex flex-col w-[45%] bg-slate-950 rounded-lg p-4">
      <p className="font-bold text-xl">{campaign.title}</p>
      <p>
        {Number(data._hex)} <span className="text-slate-400">tokens</span>
      </p>
    </div>
  );
}

export default Token;
