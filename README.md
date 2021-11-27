yarn

truffle-config.js
      host: "192.168.1.185",
      port: 21004,
      network_id: "21004", // Match any network id

truffle compile
truffle migrate
# C4ei Marketplace

### Overview 
An end-to-end blockchain based platform for c4ei ticket booking and ticket reselling between trustless parties. This will help to eliminate the current issue with the fake tickets and uncontrolled resale price for the tickets in black market. The platform is build on public Ethereum blockchain network where ERC721 tokens represent c4ei tickets and these tickets can be purchased using a platform based ERC20 token called CEIN.

### Functionality
1. An organiser can create a new fest for ticket distribution with specified ticket price and the total supply of tickets for the sale.
2. Once the c4ei is hosted on the platform, the customers have ablility to purchase the tickets directly from the organiser.
3. The customer can view the tickets they own for the available c4ei.
4. The customer have ability to sell the tickets they own either via the secondary market or directly to the peer customer, but the price at which customer can sell the ticket can not be more than 110% of the purchase price.
5. Tickets being sold through the secondary market adds a commission of 10% to the organiser which is deducted from the selling price the seller has listed.

### Technical Details
##### Smart Contract
Mainly 4 contracts listed under `./contracts` directory.
1. **CeinToken** - 
    1. A contract for ERC20 token called CEIN which is used to purchase tickets.
2. **C4eiNFT** - 
    1. A contract for ERC721 tokens to represent c4ei tickets.
    2. The owner of the contract will also have minter role and only the owner can mint new tickets.
3. **C4eiMarketplace** - 
    1. A contract which acts as a marketplace for purchasing tickets from organiser and through secondary market.
    2. This contract will act as a delegate approver for the CEIN token as well as NFT token transfers.
4. **CeinTicketsFactory** - 
    1. A contract which implements a factory pattern with C4eiNFT contract to create new c4eis on the fly.

##### React application
Listed under `./client` directory.
1. All the react components are listed under `./client/src/components` directory.
2. All the smart contract instance creation are listed under `./client/src/proxies` which implements singleton pattern.

#### How it works?

###### Creating new c4ei
1. The organiser creates a new c4ei by minting tickets using `bulkMintTickets()` of `C4eiNFT` smart contract. The minted tickets are assigned to `C4eiMarketplace` smart contract.

###### Purchase tickets from organiser
1. When customer initiates purchase from organiser, the application first sets the ticket price as the allowance of `C4eiMarketplace` contract for the customer's CEIN tokens. 
2. Then the application initiates the `purchaseTicket()` of `C4eiMarketplace` contract which transfers the CEIN tokens from customer to the organiser and then transfers the next sale ticket from `C4eiMarketplace` contract to the customer.

###### Selling tickets on secondary market
1. When customer wish to list ticket for sale on secondary market of the platform, the application initiates the `setSaleDetails()` of `C4eiNFT` contract which gives permission to `C4eiMarketplace` contract to transfer ticket token to the customer who will be purchasing the ticket.

###### Purchasing tickets from secondary market
1. When customer initiates purchase from secondary market, the application first sets the ticket selling price as the allowance of `C4eiMarketplace` contract for the customer's CEIN tokens. 
2. Then the applicaiton initiates the `secondaryPurchase()` of `C4eiMarketplace` contract which transfers the 10% commission as CEIN tokens from customer to the organiser and rest amount to the seller and transfers the ticket token from seller to buyer.

###### Selling tickets peer to peer
1. When customer wish to sell the ticket directly to another customer, the customer has to initiates `secondaryTransferTicket()` of `C4eiNFT` contract which restricts the customer from transfering ticket if the selling price is higher than 110%.

### Running the application
##### Prerequisite
1. Docker
2. Metamask plugin for browser

##### Steps
1. Clone the project.
2. Start the docker application.
3. Run the below command from the root directory to run the ethereum client and deploy the smart contracts to the network.
    ```sh
    docker-compose up --build
    ```
4. Note down first couple of private keys from the output logs.
5. Note down the CeinToken contract address.
4. Run the below command from `./client` directory to run the react application.
    ```sh
    docker-compose up --build
    ```
5. React application will be accessible at `http://localhost:3000/`.
6. Configure the Metamask with RPC url `http://0.0.0:8545`.
7. Import the accounts in the metamask by taking 1st private key from step 4 and setting it as an organiser. Add couple more accounts in metamask to act as a customers.
8. Add new CEIN token in metamask using the contract address from step 5.
9. Transfer some amount of CEIN tokens from organiser to other cutomers using metamask for testing the application.
10. Set up is completed and now the organiser account will be able to add new c4ei and customers will be able to purchase/sell the tickets.

### Future Roadmap
##### Tech debt
1. Add clone factory pattern (ERC1167 implementation) for the CeinTicketsFactory smart contract which uses delegate calls to save the gas cost for the contract deployment.
2. Reduce the gas consumption for the the bulk minting of tickets. Once solution to do is to modify the openzeppelin's ERC721 contract such that its constructor will be able to directly initialize the required values to its state variables instead of updating the state variable again and again which consumes more gas than operating on memory.
3. Add unit test cases covering all the scenarios.

##### Feature debt
1. Add one click login option using metamask and add public and private routes.
2. Add option to burn the ERC721 token during check in.
3. Add option to withdraw tickets from sale.

### Screenshots

![Create C4ei](./screenshots/create-c4ei.png)
![Purchase Ticket](./screenshots/purchase-ticket.png)
![Resale Ticket](./screenshots/resale-error.png)
![Secondary Market](./screenshots/secondary-market.png)
