// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Crowdfunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amount_collected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public number_of_campaigns = 0;

    event CampaignCreated(uint256 campaignId, address owner, string title, uint256 target, uint256 deadline);
    event DonationReceived(uint256 campaignId, address donor, uint256 amount);
    event CampaignFunded(uint256 campaignId, uint256 totalCollected);

    modifier onlyOwner(uint256 _id) {
        require(msg.sender == campaigns[_id].owner, "Only the campaign owner can call this.");
        _;
    }

    modifier campaignExists(uint256 _id) {
        require(_id < number_of_campaigns, "Campaign does not exist.");
        _;
    }

    function createCampaign(address _owner, string memory _title, string memory _description, 
    uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {
        require(_deadline > block.timestamp, "The deadline must be in the future");
        Campaign storage campaign = campaigns[number_of_campaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.image = _image;
        campaign.amount_collected = 0;

        number_of_campaigns++;
        emit CampaignCreated(number_of_campaigns - 1, _owner, _title, _target, _deadline);
        return number_of_campaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable campaignExists(_id) {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");

        if (sent) {
            campaign.amount_collected += amount;
            emit DonationReceived(_id, msg.sender, amount);
            if (campaign.amount_collected >= campaign.target) {
                emit CampaignFunded(_id, campaign.amount_collected);
            }
        }
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
}
