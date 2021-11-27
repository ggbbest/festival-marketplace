import Provider from './Provider';
import { c4eiMarketplaceABI } from '../constants';

const provider = new Provider();

const C4eiMarketplace = (contractAddress) => {
  const web3 = provider.web3;

  return new web3.eth.Contract(c4eiMarketplaceABI, contractAddress);
};

export default C4eiMarketplace;