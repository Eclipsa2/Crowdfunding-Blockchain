// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract CampaignToken is ERC20, ERC20Burnable, Pausable, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal override(ERC20) whenNotPaused
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}

contract Crowdfunding is Pausable, Ownable {
    struct Campaign {
        address owner;
        string title;
        string description;
        string image;
        uint256 target;
        uint256 deadline;
        uint256 amount_collected;
        address tokenAddress;
        address[] donators;
        uint256[] donations;
        bool completed;
        bool funded;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public number_of_campaigns = 0;

    event CampaignCreated(uint256 indexed campaignId, address owner, string title, string description, string image, address tokenAddress);
    event DonationReceived(uint256 indexed campaignId, address donor, uint256 amount);
    event TokensMinted(uint256 indexed campaignId, address donor, uint256 amount);
    event CampaignFunded(uint256 indexed campaignId, uint256 totalCollected);
    event RefundIssued(uint256 indexed campaignId, address donor, uint256 amount);

    modifier onlyOwnerOfCampaign(uint256 _id) {
        require(msg.sender == campaigns[_id].owner, "Only the campaign owner can call this.");
        _;
    }

    modifier campaignExists(uint256 _id) {
        require(_id < number_of_campaigns, "Campaign does not exist.");
        _;
    }

    function weiToEth(uint256 weiAmount) internal pure returns (uint256) {
        return weiAmount / 1 ether;
    }

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image, string memory _tokenName, string memory _tokenSymbol) public whenNotPaused returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in the future");

        CampaignToken newToken = new CampaignToken(_tokenName, _tokenSymbol);
        Campaign storage campaign = campaigns[number_of_campaigns++];
        campaign.owner = _owner;
        campaign.description = _description;
        campaign.image = _image;
        campaign.title = _title;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.tokenAddress = address(newToken);
        campaign.amount_collected = 0;
        campaign.completed = false;
        campaign.funded = false;

        emit CampaignCreated(number_of_campaigns - 1, _owner, _title, _description, _image, address(newToken));
        return number_of_campaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable whenNotPaused campaignExists(_id) {
        require(block.timestamp <= campaigns[_id].deadline, "Cannot donate, campaign ended.");
        Campaign storage campaign = campaigns[_id];

        uint256 donationWei = msg.value;
        uint256 targetEth = weiToEth(campaign.target);
        uint256 collectedEth = weiToEth(campaign.amount_collected);
        uint256 donationEth = weiToEth(donationWei);
        uint256 neededEth = targetEth - collectedEth;

        if (donationEth > neededEth) {
            uint256 excessWei = (donationEth - neededEth) * 1 ether;  // Convert excess eth back to wei
            donationWei = neededEth * 1 ether;  // Adjust the donation in wei to the needed amount
            payable(msg.sender).transfer(excessWei);  // Refund the excess in wei
        }

        campaign.donators.push(msg.sender);
        campaign.donations.push(donationWei);
        campaign.amount_collected += donationWei;

        emit DonationReceived(_id, msg.sender, donationWei);

        // Check if the campaign's funding target has been met or exceeded
        if (weiToEth(campaign.amount_collected) >= targetEth) {
            finalizeCampaign(_id); // Automatically finalize the campaign
        }
    }

    function finalizeCampaign(uint256 _id) internal {
        Campaign storage campaign = campaigns[_id];
        require(!campaign.completed, "Campaign has already been finalized.");

        campaign.completed = true;

        if (campaign.amount_collected >= campaign.target) {
            campaign.funded = true;
            ERC20 campaignToken = ERC20(campaign.tokenAddress);
            uint256 totalDonations = campaign.amount_collected; // Total tokens to distribute
            for (uint i = 0; i < campaign.donators.length; i++) {
                uint256 tokens = (campaign.donations[i] * 1000000 * (10 ** campaignToken.decimals())) / totalDonations; // Token calculation proportional to donation
                campaignToken.transfer(campaign.donators[i], tokens);
                emit TokensMinted(_id, campaign.donators[i], tokens);
            }
            emit CampaignFunded(_id, campaign.amount_collected);
        } else {
            for (uint i = 0; i < campaign.donators.length; i++) {
                payable(campaign.donators[i]).transfer(campaign.donations[i]);
                emit RefundIssued(_id, campaign.donators[i], campaign.donations[i]);
            }
        }
    }

    function checkTokenBalance(uint256 campaignId, address user) public view returns (uint256) {
        Campaign storage campaign = campaigns[campaignId];
        ERC20 campaignToken = ERC20(campaign.tokenAddress);
        return campaignToken.balanceOf(user);
    }

    function getDonators(uint256 _id) public view campaignExists(_id) returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](number_of_campaigns);
        for (uint256 i = 0; i < number_of_campaigns; i++) {
            allCampaigns[i] = campaigns[i];
        }
        return allCampaigns;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
