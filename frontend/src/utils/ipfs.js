import axios from "axios";

const PINATA_API_KEY = "18233f0e183ee1001af1";
const PINATA_SECRET_API_KEY = "f1a15a17e13a181c164df487dc382ac695bdcea8e1edf97b8dfa403148102022";

export async function uploadImageToIPFS(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    }
  );

  return `ipfs://${res.data.IpfsHash}`;
}

export async function uploadMetadataToIPFS(metadata) {
  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    metadata,
    {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
    }
  );

  return `ipfs://${res.data.IpfsHash}`;
}
