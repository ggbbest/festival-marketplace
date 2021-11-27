pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./C4eiNFT.sol";
import "./C4eiMarketplace.sol";

contract CeinTicketsFactory is Ownable {
    struct C4ei {
        string ceinName;
        string ceinSymbol;
        uint256 ticketPrice;
        uint256 totalSupply;
        address marketplace;
    }

    address[] private activeCeins;
    mapping(address => C4ei) private activeCeinsMapping;

    event Created(address ntfAddress, address marketplaceAddress);

    // Creates new NFT and a marketplace for its purchase
    function createNewCein(
        CeinToken token,
        string memory ceinName,
        string memory ceinSymbol,
        uint256 ticketPrice,
        uint256 totalSupply
    ) public onlyOwner returns (address) {
        C4eiNFT newCein =
            new C4eiNFT(
                ceinName,
                ceinSymbol,
                ticketPrice,
                totalSupply,
                msg.sender
            );

        C4eiMarketplace newMarketplace =
            new C4eiMarketplace(token, newCein);

        address newCeinAddress = address(newCein);

        activeCeins.push(newCeinAddress);
        activeCeinsMapping[newCeinAddress] = C4ei({
            ceinName: ceinName,
            ceinSymbol: ceinSymbol,
            ticketPrice: ticketPrice,
            totalSupply: totalSupply,
            marketplace: address(newMarketplace)
        });

        emit Created(newCeinAddress, address(newMarketplace));

        return newCeinAddress;
    }

    // Get all active ceins
    function getActiveCeins() public view returns (address[] memory) {
        return activeCeins;
    }

    // Get cein's details
    function getCeinDetails(address ceinAddress)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            uint256,
            address
        )
    {
        return (
            activeCeinsMapping[ceinAddress].ceinName,
            activeCeinsMapping[ceinAddress].ceinSymbol,
            activeCeinsMapping[ceinAddress].ticketPrice,
            activeCeinsMapping[ceinAddress].totalSupply,
            activeCeinsMapping[ceinAddress].marketplace
        );
    }
}
