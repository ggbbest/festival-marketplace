import Provider from './Provider';
import C4eiFactoryABI from '../abi/contracts/CeinTicketsFactory.json';

const provider = new Provider();

class C4eiFactory {
  constructor() {
    const web3 = provider.web3;
    const deploymentKey = Object.keys(C4eiFactoryABI.networks)[0];

    this.instance = new web3.eth.Contract(
      C4eiFactoryABI.abi,
      C4eiFactoryABI.networks[deploymentKey].address,
    );
  }

  getInstance = () => this.instance;
}

const c4eiFactory = new C4eiFactory();
Object.freeze(c4eiFactory);

export default c4eiFactory.getInstance();