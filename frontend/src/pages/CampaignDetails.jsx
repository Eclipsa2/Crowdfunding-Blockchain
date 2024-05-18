import { useNavigate, useParams } from "react-router-dom";
import { useContractContext } from "../context/ContractProvider";
import Button from "../ui/Button";
import { daysLeft } from "../utils/helpers";
import { useState } from "react";

/* eslint-disable react/prop-types */
function CampaignDetails() {
  const { getCampaign, isLoading: isLoadingContracts, donate } = useContractContext();
  const { campaignId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const navigate = useNavigate();

  console.log(isLoading);

  async function handleDonate() {
    setIsLoading(true);

    await donate(campaignId, amount);

    navigate("/");
    setIsLoading(false);
  }

  if (isLoadingContracts) return <div>Loading...</div>;

  const campaign = getCampaign(Number(campaignId));

  console.log(campaign);

  return (
    <>
      <div>
        <p className="font-bold text-2xl pt-4 text-slate-200">{campaign.title}</p>
      </div>
      <div className="flex w-full justify-around h-[30%]">
        <div className="w-[30%] h-full rounded-lg flex justify-between">
          <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col items-center bg-slate-950 p-4 rounded-lg justify-center h-[45%] aspect-[3/2]">
              <p className="font-bold text-2xl">{daysLeft(campaign.deadline)}</p>
              <p className="text-slate-300">days left</p>
            </div>
            <div className="flex flex-col items-center bg-slate-950 p-4 rounded-lg justify-center h-[45%] aspect-[3/2]">
              <p className="font-bold text-2xl">{campaign.amountCollected}</p>
              <p className="text-slate-300">raised out of {campaign.target}</p>
            </div>
          </div>
          <div className="h-full flex flex-col justify-between">
            <div className="flex flex-col items-center bg-slate-950 p-4 rounded-lg justify-center h-[45%] aspect-[3/2]">
              <p className="font-bold text-2xl">{campaign.donators.length} </p>
              <p className="text-slate-300">donators</p>
            </div>
            <div className="flex flex-col items-center bg-slate-950 p-4 rounded-lg justify-center h-[45%] aspect-[3/2]">
              <p className="font-bold text-2xl">{campaign.target - campaign.amountCollected}</p>
              <p className="text-slate-300">more to go</p>
            </div>
          </div>
        </div>
        <div className="aspect-[80/27] h-full rounded-lg bg-slate-950 p-4 flex flex-col justify-between">
          <p>{campaign.description}</p>
          <div>
            <p>Creator</p>
            <p>{campaign.owner}</p>
          </div>
        </div>
      </div>
      <div className="flex w-full h-[50%] justify-around">
        <img className="h-full aspect-video rounded-lg object-cover" src={campaign.image} />
        <div className="h-full w-[30%] rounded-lg bg-slate-950 flex flex-col p-4 items-center justify-between">
          <p className="text-xl text-center">Contribute to this project</p>
          <form className="w-[75%]">
            <input
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              className="bg-transparent border-b-2 w-full"
              placeholder="amount"
            />
          </form>
          <Button onClick={() => handleDonate()}>Donate</Button>
        </div>
      </div>
    </>
  );
}

export default CampaignDetails;
