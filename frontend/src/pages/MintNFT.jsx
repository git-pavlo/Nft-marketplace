import { useState } from 'react';
import { ethers } from 'ethers';
import getContract from '../utils/contract';
import uploadToPinata from '../utils/pinata';
import loadMyNFTs from './MyNFTs';
import loadMarketplace from './MyNFTs';

const MintNFT = ({ account }) => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');

  const mintNFT = async () => {
    if (!account || !file || !name) return alert("Fill all fields and connect wallet!");

    setStatus("Uploading to Pinata...");
    try {
      const tokenURI = await uploadToPinata(file, { name });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      
      const tx = await contract.mint(account, tokenURI); // mint accepts tokenURI

      await tx.wait();

      await loadMyNFTs();      // refresh owned NFTs
      await loadMarketplace(); // refresh listings

      setStatus("NFT minted successfully!");
    } catch (err) {
      console.error(err);
      setStatus("Minting failed.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Mint NFT</h1>
      <input
        type="text"
        placeholder="NFT Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2"
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-2"
      />
      <button
        onClick={mintNFT}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Mint NFT
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default MintNFT; // ✅ default export
