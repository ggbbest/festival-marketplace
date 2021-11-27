import Provider from './Provider';
import { c4eiNFTABI } from '../constants';

const provider = new Provider();

const C4eiNFT = (contractAddress) => {
  const web3 = provider.web3;

  return new web3.eth.Contract(c4eiNFTABI, contractAddress);
};

export default C4eiNFT;