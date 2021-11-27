pragma solidity ^0.6.0;

import "./C4eiNFT.sol";
import "./CeinToken.sol";

contract C4eiMarketplace {
    CeinToken private _token;
    C4eiNFT private _c4ei;

    address private _organiser;

    constructor(CeinToken token, C4eiNFT c4ei) public {
        _token = token;
        _c4ei = c4ei;
        _organiser = _c4ei.getOrganiser();
    }

    event Purchase(address indexed buyer, address seller, uint256 ticketId);

    // Purchase tickets from the organiser directly
    function purchaseTicket() public {
        address buyer = msg.sender;

        _token.transferFrom(buyer, _organiser, _c4ei.getTicketPrice());

        _c4ei.transferTicket(buyer);
    }

    // Purchase ticket from the secondary market hosted by organiser
    function secondaryPurchase(uint256 ticketId) public {
        address seller = _c4ei.ownerOf(ticketId);
        address buyer = msg.sender;
        uint256 sellingPrice = _c4ei.getSellingPrice(ticketId);
        uint256 commision = (sellingPrice * 10) / 100;

        _token.transferFrom(buyer, seller, sellingPrice - commision);
        _token.transferFrom(buyer, _organiser, commision);

        _c4ei.secondaryTransferTicket(buyer, ticketId);

        emit Purchase(buyer, seller, ticketId);
    }
}
