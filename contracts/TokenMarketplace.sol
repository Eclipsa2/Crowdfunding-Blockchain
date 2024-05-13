// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenMarketplace is ReentrancyGuard {
    using SafeERC20 for ERC20;

    struct Offer {
        address seller;
        address token;
        uint256 tokenAmount;
        uint256 totalPrice; // Total price for all tokens in wei
        uint256 campaignId; // Unique ID of the campaign associated with these tokens
        bool isActive;
    }

    Offer[] public offers;

    event OfferCreated(uint256 indexed offerId, address indexed token, address indexed seller, uint256 tokenAmount, uint256 totalPrice, uint256 campaignId);
    event OfferCancelled(uint256 indexed offerId);
    event TokensPurchased(uint256 indexed offerId, address indexed token, address indexed buyer, uint256 tokenAmount, uint256 totalPrice);

    function listTokens(address tokenAddress, uint256 tokenAmount, uint256 totalPrice, uint256 campaignId) public {
        require(tokenAmount > 0, "Token amount must be greater than zero.");
        require(totalPrice > 0, "Total price must be greater than zero.");

        ERC20 token = ERC20(tokenAddress);
        token.safeTransferFrom(msg.sender, address(this), tokenAmount);

        Offer memory newOffer = Offer({
            seller: msg.sender,
            token: tokenAddress,
            tokenAmount: tokenAmount,
            totalPrice: totalPrice,
            campaignId: campaignId,
            isActive: true
        });

        offers.push(newOffer);
        uint256 offerId = offers.length - 1;
        emit OfferCreated(offerId, tokenAddress, msg.sender, tokenAmount, totalPrice, campaignId);
    }

    function cancelOffer(uint256 offerId) public {
        require(offerId < offers.length, "Offer does not exist.");
        Offer storage offer = offers[offerId];
        require(offer.seller == msg.sender, "Only the seller can cancel this offer.");
        require(offer.isActive, "Offer is not active.");

        offer.isActive = false;
        ERC20 token = ERC20(offer.token);
        token.safeTransfer(msg.sender, offer.tokenAmount);

        emit OfferCancelled(offerId);
    }

    function buyTokens(uint256 offerId) public payable nonReentrant {
        require(offerId < offers.length, "Offer does not exist.");
        Offer storage offer = offers[offerId];
        require(offer.isActive, "Offer is not active.");
        require(msg.value == offer.totalPrice, "Incorrect amount of ETH sent.");

        offer.isActive = false;
        payable(offer.seller).transfer(msg.value);
        ERC20 token = ERC20(offer.token);
        token.safeTransfer(msg.sender, offer.tokenAmount);

        emit TokensPurchased(offerId, offer.token, msg.sender, offer.tokenAmount, msg.value);
    }
}
