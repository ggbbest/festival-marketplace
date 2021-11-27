import React, { Component } from 'react';
import Web3 from 'web3';
import c4eiFactory from '../proxies/C4eiFactory';
import C4eiNFT from '../proxies/C4eiNFT';
import C4eiMarketplace from '../proxies/C4eiMarketplace';
import ceinToken from '../proxies/CeinToken';
import renderNotification from '../utils/notification-handler';

let web3;

class SecondaryMarket extends Component {
  constructor() {
    super();

    this.state = {
      tickets: [],
      ceins: [],
      ticket: null,
      cein: null,
      marketplace: null,
      price: null,
      renderTickets: [],
    };

    web3 = new Web3(window.ethereum);
  }

  async componentDidMount() {
    await this.updateC4eis();
    if (this.state.cein) {
      await this.updateTickets()
    }
  }

  updateTickets = async () => {
    try {
      const { cein } = this.state;
      const initiator = await web3.eth.getCoinbase();
      const nftInstance = await C4eiNFT(this.state.cein);
      const saleTickets = await nftInstance.methods.getTicketsForSale().call({ from: initiator });
      const renderData = await Promise.all(saleTickets.map(async ticketId => {
        const { purchasePrice, sellingPrice, forSale } = await nftInstance.methods.getTicketDetails(ticketId).call({ from: initiator });

        const ceinDetails = await c4eiFactory.methods.getCeinDetails(cein).call({ from: initiator });
        const [ceinName] = Object.values(ceinDetails);

        if (forSale) {
          return (
            <tr key={ticketId}>
              <td class="center">{ceinName}</td>
              <td class="center">{ticketId}</td>
              <td class="center">{web3.utils.fromWei(sellingPrice, 'ether')}</td>

              <td class="center"><button type="submit" className="custom-btn login-btn" onClick={this.onPurchaseTicket.bind(this, ticketId, sellingPrice, initiator)}>Buy</button></td>
            </tr>
          );
        }
      }));

      this.setState({ renderTickets: renderData });
    } catch (err) {
      renderNotification('danger', 'Error', 'Error wile updating sale tickets');
      console.log('Error wile updating sale tickets', err);
    }
  }

  onPurchaseTicket = async (ticketId, sellingPrice, initiator) => {
    try {
      const { marketplace } = this.state;
      const marketplaceInstance = await C4eiMarketplace(marketplace);
      await ceinToken.methods.approve(marketplace, sellingPrice).send({ from: initiator, gas: 6700000 });
      await marketplaceInstance.methods.secondaryPurchase(ticketId).send({ from: initiator, gas: 6700000 });
      await this.updateTickets()

      renderNotification('success', 'Success', 'Ticket purchased for the c4ei successfully!');
    } catch (err) {
      renderNotification('danger', 'Error', err.message);
      console.log('Error while purchasing the ticket', err);
    }
  }


  updateC4eis = async () => {
    try {
      const initiator = await web3.eth.getCoinbase();
      const activeCeins = await c4eiFactory.methods.getActiveCeins().call({ from: initiator });
      const ceinDetails = await c4eiFactory.methods.getCeinDetails(activeCeins[0]).call({ from: initiator });
      const renderData = await Promise.all(activeCeins.map(async (cein, i) => {
        const ceinDetails = await c4eiFactory.methods.getCeinDetails(activeCeins[i]).call({ from: initiator });
        return (
          <option key={cein} value={cein} >{ceinDetails[0]}</option>
        )
      }));

      this.setState({ ceins: renderData, cein: activeCeins[0], marketplace: ceinDetails[4], ceinName: ceinDetails[0] });
    } catch (err) {
      renderNotification('danger', 'Error', 'Error while updating the nft.C4ei.net');
      console.log('Error while updating the nft.C4ei.net', err);
    }
  }

  onC4eiChangeHandler = async (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);

    const { cein } = this.state;
    const initiator = await web3.eth.getCoinbase();
    const ceinDetails = await c4eiFactory.methods.getCeinDetails(cein).call({ from: initiator });

    this.setState({ marketplace: ceinDetails[4] });
    await this.updateTickets();
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    console.log('input', e.target.name, e.target.value)
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div class="container center" >
        <div class="row">
          <div class="container ">
            <div class="container ">

              <h5 style={{ padding: "30px 0px 0px 10px" }}>Secondary Marketplace</h5>

              <label class="left">C4ei</label>
              <select className="browser-default" name='cein' value={this.state.cein || undefined} onChange={this.onC4eiChangeHandler}>
                <option value="" disabled >Select C4ei</option>
                {this.state.ceins}
              </select><br /><br />

              <h4 class="center">Purchase Tickets</h4>

              <table id='requests' class="responsive-table striped" >
                <thead>
                  <tr>
                    <th key='name' class="center">Cein Name</th>
                    <th key='ticketId' class="center">Ticket Id</th>
                    <th key='cost' class="center">Cost(in CEIN)</th>
                    <th key='purchase' class="center">Purchase</th>
                  </tr>
                </thead>
                <tbody class="striped highlight">
                  {this.state.renderTickets}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default SecondaryMarket;