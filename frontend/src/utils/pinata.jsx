import axios from "axios"

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY

const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs/"

export async function uploadFileToIPFS(file) {
  const data = new FormData()
  data.append("file", file)

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    data,
    {
      maxBodyLength: Infinity,
      timeout: 1200000,
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    }
  )

  return `${PINATA_GATEWAY}${res.data.IpfsHash}`
}

export async function uploadMetadata(name, description, image) {
  const metadata = {
    name,
    description,
    image,
  }

  const res = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    metadata,
    {
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    }
  )

  return `${PINATA_GATEWAY}${res.data.IpfsHash}`
}
