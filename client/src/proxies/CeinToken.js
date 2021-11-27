import Provider from './Provider';
import CeinToken from '../abi/contracts/CeinToken.json';

const provider = new Provider();

class Token {
  constructor() {
    const web3 = provider.web3;
    const deploymentKey = Object.keys(CeinToken.networks)[0];

    this.instance = new web3.eth.Contract(
      CeinToken.abi,
      CeinToken.networks[deploymentKey].address,
    );
  }

  getInstance = () => this.instance;
}

const token = new Token();
Object.freeze(token);

export default token.getInstance();