import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';
import Web3 from 'web3';
import C4ei from './components/C4ei';
import Purchase from './components/Purchase';
import MyTickets from './components/MyTickets';
import SecondaryMarket from './components/SecondaryMarket';
import AccountDetails       from "./components/AccountDetails/AccountDetails";
import ConnectToMetamask    from "./components/ConnectMetamask/ConnectToMetamask";
import Loading              from "./components/Loading/Loading";
import ContractNotDeployed  from "./components/ContractNotDeployed/ContractNotDeployed";
import C4eiFactoryABI from './abi/contracts/CeinTicketsFactory.json';
class App extends Component {

  constructor() {
    super();
    this.state = {
      accountAddress: "",
      accountBalance: "",
      c4eiFactoryContract: null,
      loading: true,
      metamaskConnected: false,
      contractDetected: false,
    };
    // new Promise((resolve, reject) => {
    //   if (typeof window.ethereum !== 'undefined') {
    //     const web3 = new Web3(window.ethereum);
    //     window.ethereum.enable()
    //       .then(() => { resolve( new Web3(window.ethereum) ); })
    //       .catch(e => { reject(e); });
    //     return;
    //   }
    //   if (typeof window.web3 !== 'undefined') { return resolve( new Web3(window.web3.currentProvider) );
    //   } else { window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!"); }
    //   // resolve(new Web3('http://192.168.1.185:21004'));
    // });

    // window.ethereum.on('accountsChanged', function () {
    //   window.location.reload();
    // });
  }
  
  componentWillMount = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
  };
  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };
  loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.setState({ metamaskConnected: false });
    } else {
      this.setState({ metamaskConnected: true });
      this.setState({ loading: true });
      this.setState({ accountAddress: accounts[0] });
      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      this.setState({ accountBalance });
      this.setState({ loading: false });
      const networkId = await web3.eth.net.getId();
      const networkData = C4eiFactoryABI.networks[networkId];
      if (networkData) {
        this.setState({ loading: true });
        //CeinTicketsFactory
        console.log(networkData.address + " : networkData.address"); //0xBdcD7A4eA5d7925cFC9749cE5A485b5ccb045f53
        const c4eiFactoryContract = new web3.eth.Contract( C4eiFactoryABI.abi, networkData.address );

        this.setState({ c4eiFactoryContract });
        this.setState({ contractDetected: true });
        // const cryptoBoysCount = await c4eiFactoryContract.methods
        //   .cryptoBoyCounter()
        //   .call();
        // this.setState({ cryptoBoysCount });
        // for (var i = 1; i <= cryptoBoysCount; i++) {
        //   const cryptoBoy = await c4eiFactoryContract.methods
        //     .allCryptoBoys(i)
        //     .call();
        //   this.setState({
        //     cryptoBoys: [...this.state.cryptoBoys, cryptoBoy],
        //   });
        // }
        // let totalTokensMinted = await c4eiFactoryContract.methods
        //   .getNumberOfTokensMinted()
        //   .call();
        // totalTokensMinted = totalTokensMinted.toNumber();
        // this.setState({ totalTokensMinted });
        // let totalTokensOwnedByAccount = await c4eiFactoryContract.methods
        //   .getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress)
        //   .call();
        // totalTokensOwnedByAccount = totalTokensOwnedByAccount.toNumber();
        // this.setState({ totalTokensOwnedByAccount });
        this.setState({ loading: false });
      } else {
        this.setState({ contractDetected: false });
      }
    }

  }
  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.reload();
  };


  render() {
    return (
      <Router>

        <div >
          <ReactNotification />
          <nav style={{ padding: '0px 30px 0px 30px' }}>
            <div class="nav-wrapper" >
              <a href="/buyTickets" class="brand-logo left">C4ei Marketplace</a>
              <ul class="right hide-on-med-and-down 10" >
                <div>
                  <li> <Link to="/createC4ei">Add C4ei</Link> </li>
                  <li> <Link to="/buyTickets">Buy Tickets</Link> </li>
                  <li> <Link to="/market">Secondary Market</Link> </li>
                  <li> <Link to="/tickets">MyTickets</Link> </li>
                  {/* <li> <Link to="/AccountDetails">AccountDetails</Link> </li>
                  <li> <Link to="/ConnectToMetamask">Metamask</Link> </li> */}
                  <li >
                  </li>
                </div>

              </ul>
            </div>
          </nav>

          <Switch>
            <Route path="/createC4ei" component={C4ei} />
            <Route path="/buyTickets" component={Purchase} />
            <Route path="/market" component={SecondaryMarket} />
            <Route path="/tickets" component={MyTickets} />
            {!this.state.metamaskConnected ? (<ConnectToMetamask connectToMetamask={this.connectToMetamask} />) : 
        !this.state.contractDetected ? (<ContractNotDeployed />) : this.state.loading ? (<Loading />) : (<AccountDetails/>) }
          </Switch>
        </div>

      </Router >
    )
  }
}

export default App;
