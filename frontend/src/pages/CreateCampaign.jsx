import { useState } from "react";
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import Button from "../ui/Button";
import { useContractContext } from "../context/ContractProvider";
import { ethers } from "ethers";

function CreateCampaign() {
  const [date, setDate] = useState(Date.now());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState(1);
  const [imgSrc, setImgSrc] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");

  const { address, publishCampaign } = useContractContext();

  const inputStyle =
    "w-full bg-transparent text-slate-200 placeholder:italic border-b-[1px] focus:outline-none mb-8 mt-2";

  const labelStyle = "text-2xl font-semibold";

  async function createCampaign() {
    if (address) {
      const newCampaign = {
        title,
        description,
        target: ethers.utils.parseUnits(target, 18),
        deadline: new Date(date),
        image: imgSrc,
        tokenName,
        tokenSymbol,
      };
      console.log(newCampaign);
      await publishCampaign(newCampaign);
    }
  }

  return (
    <>
      <div>
        <p className="font-bold text-2xl pt-4 text-slate-200">Create new campaign</p>
      </div>
      <div className="flex items-center justify-around">
        <div className="flex flex-col h-full w-[40%] items-center justify-around">
          <form
            className="flex flex-col w-full"
            onSubmit={(e) => {
              e.preventDefault();
              createCampaign();
            }}
          >
            <label className={labelStyle} htmlFor="title">
              Campaign title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputStyle}
              name="title"
              type="text"
              placeholder="My campaign"
            />
            <label className={labelStyle} htmlFor="description">
              Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputStyle}
              name="description"
              type="text"
              placeholder="My campaign is a must"
            />
            <label className={labelStyle} htmlFor="target">
              Target
            </label>
            <div className="flex">
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className={inputStyle}
                name="target"
                type="number"
                placeholder="1"
              />
              <span>ETH</span>
            </div>
            <label className={labelStyle} htmlFor="deadline">
              Deadline
            </label>
            <ReactDatePicker
              name="deadline"
              className={inputStyle}
              selected={date}
              onChange={(d) => setDate(d)}
            />
            <div className="flex gap-4">
              <div>
                <label className={labelStyle} htmlFor="tokenName">
                  Token name
                </label>
                <input
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  className={inputStyle}
                  name="tokenName"
                  placeholder="My token name"
                />
              </div>
              <div>
                <label className={labelStyle} htmlFor="tokenTag">
                  Token symbol
                </label>
                <input
                  value={tokenSymbol}
                  onChange={(e) => setTokenSymbol(e.target.value)}
                  className={inputStyle}
                  name="tokenTag"
                  placeholder="TKSYMB"
                />
              </div>
            </div>
            <button className="hidden"></button>
          </form>
          <Button onClick={() => createCampaign()}>Create campaign</Button>
        </div>
        <div className="w-[50%]">
          {!imgSrc ? (
            <div className="flex items-start gap-2">
              <input
                type="text"
                placeholder="Image URL"
                className={inputStyle}
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
              />
              <Button onClick={() => setImgSrc(imgUrl)}>Add</Button>
            </div>
          ) : (
            <div className=" aspect-video">
              <img className="rounded-lg w-full h-full" src={imgSrc} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CreateCampaign;
