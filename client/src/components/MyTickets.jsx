import React, { Component } from 'react';
import Web3 from 'web3';
import c4eiFactory from '../proxies/C4eiFactory';
import C4eiNFT from '../proxies/C4eiNFT';
import renderNotification from '../utils/notification-handler';

let web3;

class MyTickets extends Component {
  constructor() {
    super();

    this.state = {
      tickets: [],
      ceins: [],
      ticket: null,
      cein: null,
      marketplace: null,
      price: null,
      test: null,
    };

    web3 = new Web3(window.ethereum);
  }

  async componentDidMount() {
    await this.updateC4eis();
  }

  onListForSale = async (e) => {
    try {
      e.preventDefault();
      const initiator = await web3.eth.getCoinbase();
      const { ticket, price, marketplace } = this.state;
      const nftInstance = await C4eiNFT(this.state.cein);
      await nftInstance.methods.setSaleDetails(ticket, web3.utils.toWei(price, 'ether'), marketplace).send({ from: initiator, gas: 8000000 });

      renderNotification('success', 'Success', `Ticket is listed for sale in secondary market!`);
    } catch (err) {
      console.log('Error while lisitng for sale', err);
      renderNotification('danger', 'Error', err.message.split(' ').slice(8).join(' '));
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

      this.setState({ ceins: renderData, cein: activeCeins[0], marketplace: ceinDetails[4] });
      this.updateTickets();
    } catch (err) {
      renderNotification('danger', 'Error', 'Error while updating the nft.C4ei.net');
      console.log('Error while updating the nft.C4ei.net', err);
    }
  }

  updateTickets = async () => {
    try {
      const initiator = await web3.eth.getCoinbase();
      const nftInstance = await C4eiNFT(this.state.cein);
      const tickets = await nftInstance.methods.getTicketsOfCustomer(initiator).call({ from: initiator });
      const renderData = tickets.map((ticket, i) => (
        <option key={ticket} value={ticket} >{ticket}</option>
      ));

      this.setState({ tickets: renderData, ticket: tickets[0] });
    } catch (err) {
      renderNotification('danger', 'Error', 'Error in updating the ticket for c4ei');
      console.log('Error in updating the ticket', err);
    }
  }

  onC4eiChangeHandler = async (e) => {
    try {
      const state = this.state;
      state[e.target.name] = e.target.value;
      this.setState(state);

      const { cein } = this.state;
      await this.updateTickets(cein);

      const initiator = await web3.eth.getCoinbase();
      const ceinDetails = await c4eiFactory.methods.getCeinDetails(cein).call({ from: initiator });

      this.setState({ marketplace: ceinDetails[4] });
    } catch (err) {
      console.log('Error while tickets for c4ei', err.message);
      renderNotification('danger', 'Error', 'Error while tickets for c4ei');
    }
  }

  selectHandler = (e) => {
    this.setState({ ticket: e.target.value });
  }

  inputChangedHandler = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  render() {
    return (
      <div class="container center" >
        <div class="row">
          <div class="container ">
            <div class="container ">
              <h5 style={{ padding: "30px 0px 0px 10px" }}>My Tickets</h5>
              <form class="" onSubmit={this.onListForSale}>

                <label class="left">C4ei</label>
                <select className="browser-default" name='cein' value={this.state.cein || undefined} onChange={this.onC4eiChangeHandler}>
                  <option value="" disabled >Select C4ei</option>
                  {this.state.ceins}
                </select><br /><br />

                <label class="left">Ticket Id</label>
                <select className="browser-default" name='ticket' value={this.state.ticket || undefined} onChange={this.selectHandler}>
                  <option value="" disabled>Select Ticket</option>
                  {this.state.tickets}
                </select><br /><br />

                <label class="left">Sale Price</label><input id="price" placeholder="Sale Price" type="text" className="input-control" name="price" onChange={this.inputChangedHandler} /><br /><br />

                <button type="submit" className="custom-btn login-btn">List for Sale</button>
              </form>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default MyTickets;  