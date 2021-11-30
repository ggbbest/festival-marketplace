import React, { Component } from 'react';
import Web3 from 'web3';
import c4eiFactory from '../proxies/C4eiFactory';
import C4eiNFT from '../proxies/C4eiNFT';
import C4eiMarketplace from '../proxies/C4eiMarketplace';
import ceinToken from '../proxies/CeinToken';
import renderNotification from '../utils/notification-handler';

let web3;

class Purchase extends Component {
  constructor() {
    super();

    this.state = {
      c4eis: [],
    };

    web3 = new Web3(window.ethereum);
  }

  async componentDidMount() {
    await this.updateC4eis();
  }

  updateC4eis = async () => {
    try {
      const initiator = await web3.eth.getCoinbase();
      const activeCeins = await c4eiFactory.methods.getActiveCeins().call({ from: initiator });
      const ceins = await Promise.all(activeCeins.map(async cein => {
        const ceinDetails = await c4eiFactory.methods.getCeinDetails(cein).call({ from: initiator });
        const [ceinName, ceinSymbol, ticketPrice, totalSupply, marketplace] = Object.values(ceinDetails);
        const nftInstance = await C4eiNFT(cein);
        const saleId = await nftInstance.methods.getNextSaleTicketId().call({ from: initiator });

        return (
          <tr key={cein}>
            <td class="center">{ceinName}</td>
            <td class="center">{web3.utils.fromWei(ticketPrice, 'ether')}</td>
            <td class="center">{totalSupply - saleId}</td>

            <td class="center"><button type="submit" className="custom-btn login-btn" onClick={this.onPurchaseTicket.bind(this, marketplace, ticketPrice, initiator)}>Buy</button></td>
          </tr>
        );
      }));

      this.setState({ c4eis: ceins });
    } catch (err) {
      renderNotification('danger', 'Error', err.message);
      console.log('Error while updating the nft.C4ei.net', err);
    }
  }

  onPurchaseTicket = async (marketplace, ticketPrice, initiator) => {
    try {
      const marketplaceInstance = await C4eiMarketplace(marketplace);
      await ceinToken.methods.approve(marketplace, ticketPrice).send({ from: initiator, gas: 8000000 });
      await marketplaceInstance.methods.purchaseTicket().send({ from: initiator, gas: 8000000 });
      await this.updateC4eis();

      renderNotification('success', 'Success', `Ticket for the C4ei purchased successfully!`);
    } catch (err) {
      console.log('Error while creating new c4ei', err);
      renderNotification('danger', 'Error', err.message);
    }
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div class="container " class="col s12 m6 offset-m3 l4 offset-l4 z-depth-6 card-panel">
        <h4 class="center">Purchase Tickets</h4>
        <table id='requests' class="responsive-table striped" >
          <thead>
            <tr>
              <th key='name' class="center">Name</th>
              <th key='price' class="center">Price(in CEIN)</th>
              <th key='left' class="center">Tickets Left</th>
              <th key='purchase' class="center">Purchase</th>
            </tr>
          </thead>
          <tbody class="striped highlight">
            {this.state.c4eis}
          </tbody>
        </table>
      </div >
    )
  }
}

export default Purchase;  