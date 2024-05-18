import { HiOutlineHome, HiOutlinePlusCircle, HiOutlineScale, HiOutlineUser } from "react-icons/hi";
import { HiOutlineWallet } from "react-icons/hi2";
import { NavLink } from "react-router-dom";
import { useContractContext } from "../context/ContractProvider";

function Sidebar() {
  const { address } = useContractContext();

  return (
    <div className="flex flex-col py-8 items-center">
      <div className="font-teko font-bold text-5xl">FundChain</div>
      <div className="flex flex-col mt-24 gap-4">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive
              ? "flex items-center gap-1 p-2 text-blue-300 bg-slate-700 rounded-lg"
              : "flex items-center gap-1 p-2"
          }
        >
          <HiOutlineHome className="text-2xl" />
          <p className="text-xl">Home</p>
        </NavLink>

        {address && (
          <>
            <NavLink
              to="/createCampaign"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-1 p-2 text-blue-300 bg-slate-700 rounded-lg"
                  : "flex items-center gap-1 p-2"
              }
            >
              <HiOutlinePlusCircle className="text-2xl" />
              <p className="text-xl">Start a Campaign</p>
            </NavLink>
            <NavLink
              to="/myCampaigns"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-1 p-2 text-blue-300 bg-slate-700 rounded-lg"
                  : "flex items-center gap-1 p-2"
              }
            >
              <HiOutlineUser className="text-2xl" />
              <p className="text-xl">My Campaigns</p>
            </NavLink>
            <NavLink
              to="/tokenWallet"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-1 p-2 text-blue-300 bg-slate-700 rounded-lg"
                  : "flex items-center gap-1 p-2"
              }
            >
              <HiOutlineWallet className="text-2xl" />
              <p className="text-xl">My Wallet</p>
            </NavLink>
            <NavLink
              to="/tokenMarketplace"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center gap-1 p-2 text-blue-300 bg-slate-700 rounded-lg"
                  : "flex items-center gap-1 p-2"
              }
            >
              <HiOutlineScale className="text-2xl" />
              <p className="text-xl">Token Marketplace</p>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
