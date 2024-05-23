// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TokenMarketplace {
    struct Listing {
        address seller;
        address tokenAddress;
        uint256 tokenAmount;
        uint256 totalPrice;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;

    event ListingCreated(
        uint256 indexed listingId,
        address indexed seller,
        address indexed tokenAddress,
        uint256 tokenAmount,
        uint256 totalPrice
    );
    event ListingPurchased(
        uint256 indexed listingId,
        address indexed buyer,
        uint256 tokenAmount,
        uint256 totalPrice
    );

    function createListing(
        address _tokenAddress,
        uint256 _tokenAmount,
        uint256 _totalPrice
    ) external {
        require(_tokenAmount > 0, "Token amount must be greater than 0");
        require(_totalPrice > 0, "Total price must be greater than 0");

        IERC20 tokenContract = IERC20(_tokenAddress);
        require(
            tokenContract.balanceOf(msg.sender) >= _tokenAmount,
            "Insufficient token balance"
        );

        // Approve the TokenMarketplace contract to spend the listed token amount
        require(
            tokenContract.approve(address(this), _tokenAmount),
            "Approval failed"
        );

        listings[listingCounter] = Listing(
            msg.sender,
            _tokenAddress,
            _tokenAmount,
            _totalPrice,
            true
        );

        emit ListingCreated(
            listingCounter,
            msg.sender,
            _tokenAddress,
            _tokenAmount,
            _totalPrice
        );
        listingCounter++;
    }

    function purchaseListing(uint256 _listingId) external payable {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing is not active");
        require(
            msg.value == listing.totalPrice,
            "Incorrect payment amount"
        );

        IERC20 tokenContract = IERC20(listing.tokenAddress);

        require(
            tokenContract.transferFrom(
                listing.seller,
                msg.sender,
                listing.tokenAmount
            ),
            "Token transfer failed"
        );

        payable(listing.seller).transfer(listing.totalPrice);
        listing.active = false;

        emit ListingPurchased(
            _listingId,
            msg.sender,
            listing.tokenAmount,
            listing.totalPrice
        );
    }

    function cancelListing(uint256 _listingId) external {
        Listing storage listing = listings[_listingId];
        require(
            listing.seller == msg.sender,
            "Only the seller can cancel the listing"
        );
        require(listing.active, "Listing is not active");

        listing.active = false;
    }

    function getAllListings() external view returns (Listing[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < listingCounter; i++) {
            if (listings[i].active) {
                activeCount++;
            }
        }

        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < listingCounter; i++) {
            if (listings[i].active) {
                activeListings[index] = listings[i];
                index++;
            }
        }

        return activeListings;
    }
}
