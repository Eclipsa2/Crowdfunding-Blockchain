import { daysLeft } from "../utils/helpers";

/* eslint-disable react/prop-types */
function CampaignCard({ onClick, campaign }) {
  return (
    <div
      onClick={onClick}
      className="w-[20rem] h-[24rem] rounded-xl bg-slate-950 grid grid-rows-[auto_1fr] cursor-pointer"
    >
      <div>
        <img className="w-[20rem] aspect-video rounded-xl object-cover" src={campaign.image} />
      </div>
      <div className="p-2 flex flex-col justify-between w-[20rem]">
        <div>
          <p className="font-semibold text-lg">{campaign.title}</p>
          <p className="text-slate-400 text-sm">{campaign.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p>
              <span className="font-semibold">{campaign.amountCollected}</span> ETH
            </p>
            <p>raised of {campaign.target} ETH</p>
          </div>
          <div>
            <p>{daysLeft(campaign.deadline)}</p>
            <p>Days left</p>
          </div>
        </div>
        <div className="overflow-clip">
          <p className="text-slate-400 text-xs">
            by <span className="font-semibold text-slate-200">{campaign.owner}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CampaignCard;
