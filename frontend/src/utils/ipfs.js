import axios from "axios";

const PINATA_API_KEY = "d2a633329f04dab4521a";
const PINATA_SECRET_API_KEY = "5e5296dabf66722297392166591bd27a789807af4b9986dcbc5a7c5ae45ce50d";

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
