import Web3 from 'web3';

class Provider {
  constructor() {
    // if (window.ethereum) {
    //   window.web3 = new Web3(window.ethereum);
    // } else if (window.web3) {
    //   window.web3 = new Web3(window.web3.currentProvider);
    // } else {
    //   window.alert(
    //     "Non-Ethereum browser detected. You should consider trying MetaMask!"
    //   );
    // }

    this.web3 = new Web3(
      // new Web3.providers.HttpProvider('http://192.168.1.185:21004'),
      // new Web3.providers.HttpProvider('https://rpc.c4ei.net'),
      window.web3.currentProvider,
    );
  }
}

export default Provider;