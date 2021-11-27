import Web3 from 'web3';

class Provider {
  constructor() {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider('http://192.168.1.185:21004'),
    );
  }
}

export default Provider;