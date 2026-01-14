import axios from 'axios';

const uploadToPinata = async (file, metadata) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('pinataMetadata', JSON.stringify({ name: metadata.name }));

  const res = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
    },
  });

  return `ipfs://${res.data.IpfsHash}`;
};

export default uploadToPinata; // ✅ default export
