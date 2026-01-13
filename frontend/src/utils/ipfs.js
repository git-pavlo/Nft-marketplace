import { create } from "ipfs-http-client";

const projectId = "YOUR_INFURA_PROJECT_ID";
const projectSecret = "YOUR_INFURA_PROJECT_SECRET";

const auth =
  "Basic " + btoa(projectId + ":" + projectSecret);

export const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export async function uploadToIPFS(file) {
  const added = await ipfs.add(file);
  return `https://ipfs.io/ipfs/${added.path}`;
}

export async function uploadMetadata(imageUrl, name, description) {
  const metadata = JSON.stringify({
    name,
    description,
    image: imageUrl,
  });

  const added = await ipfs.add(metadata);
  return `https://ipfs.io/ipfs/${added.path}`;
}
