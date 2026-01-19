import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { uploadFileToIPFS, uploadMetadata } from "../utils/pinata"
import { getNFTContract } from "../utils/web3"
import { MARKETPLACE_ADDRESS } from "../utils/constants"

export default function Mint() {
  const [image, setImage] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  // const [category, setCategory] = useState("")

  const [loading, setLoading] = useState(false)

  // cooldown
  const [canMint, setCanMint] = useState(true)
  const [cooldownLeft, setCooldownLeft] = useState(0)

  // gas preview
  const [gasCost, setGasCost] = useState(null)
  const [totalCost, setTotalCost] = useState(null)

  const MINT_FEE = 0.01

  /* ---------------- COOLDOWN ---------------- */

  async function checkCooldown() {
    try {
      if (!window.ethereum) return

      const nft = await getNFTContract()
      const [account] = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      const lastMint = await nft.lastMintTime(account)
      const cooldown = await nft.mintCooldown()

      const now = Math.floor(Date.now() / 1000)
      const end = Number(lastMint) + Number(cooldown)

      if (now >= end) {
        setCanMint(true)
        setCooldownLeft(0)
      } else {
        setCanMint(false)
        setCooldownLeft(end - now)
      }
    } catch (err) {
      console.error("Cooldown check failed", err)
    }
  }

  useEffect(() => {
    checkCooldown()
  }, [])

  useEffect(() => {
    if (cooldownLeft <= 0) return

    const timer = setInterval(() => {
      setCooldownLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanMint(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldownLeft])

  function formatTime(sec) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  /* ---------------- GAS ESTIMATION (ethers v6) ---------------- */

  async function estimateMintGas(metadataUrl) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const nft = await getNFTContract(true)

    const gasLimit = await nft.mint.estimateGas(metadataUrl, {
      value: ethers.parseEther(MINT_FEE.toString()),
    })

    const feeData = await provider.getFeeData()

    // 🔑 HARDHAT + TESTNET SAFE
    const gasPrice =
      feeData.gasPrice ??
      feeData.maxFeePerGas ?? // fallback
      ethers.parseUnits("1", "gwei")

    const gasEth = ethers.formatEther(gasLimit * gasPrice)

    setGasCost(Number(gasEth).toFixed(6))
    setTotalCost((Number(gasEth) + MINT_FEE).toFixed(6))
  } catch (err) {
    console.error("Gas estimation failed", err)
    setGasCost("—")
    setTotalCost("—")
  }
}


  /* ---------------- MINT NFT ---------------- */

  async function mintNFT() {
    if (!canMint) {
      alert(`⏳ Cooldown active. Please wait ${formatTime(cooldownLeft)}.`)
      return
    }

    if (!image || !name || !description || !category) {
      alert("Please fill all fields")
      return
    }

    try {
      setLoading(true)

      // 1️⃣ Upload image
      const imageUrl = await uploadFileToIPFS(image)

      // 2️⃣ Upload metadata
      const metadataUrl = await uploadMetadata(
        name,
        description,
        imageUrl,
        // category
      )

      // 🔍 Estimate gas BEFORE mint
      await estimateMintGas(metadataUrl)

      // 3️⃣ Mint
      const nft = await getNFTContract(true)
      const tx = await nft.mint(metadataUrl, {
        value: ethers.parseEther(MINT_FEE.toString()),
      })
      await tx.wait()

      alert("✅ NFT minted successfully!")

      // refresh cooldown immediately
      await checkCooldown()
    } catch (err) {
      console.error(err)

      let message = err?.reason || err?.data?.message || err.message

      if (message?.includes("cooldown")) {
        alert("⏳ Please wait before minting again.")
      } else if (message?.includes("Mint fee")) {
        alert("💰 Not enough ETH to mint.")
      } else if (message?.includes("user rejected")) {
        alert("❌ Transaction cancelled.")
      } else {
        alert("⚠️ " + message)
      }
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-md mx-auto mt-48 bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl mb-5 text-cyan-400 font-bold text-center">
        Mint New NFT
      </h2>

      {/* IMAGE */}
      <div className="mb-4 flex">
        <input
          type="file"
          id="nft-image"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          className="hidden"
        />
        <label
          htmlFor="nft-image"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer"
        >
          Choose image
        </label>
        {image && <p className="ml-3 text-gray-400">{image.name}</p>}
      </div>

      {/* INFO */}
      <div className="bg-slate-900 p-4 rounded-xl text-sm text-gray-400 mb-4">
        <p>💰 Mint fee: <b>{MINT_FEE} ETH</b></p>
        <p>⏳ Cooldown: <b>5 minutes</b></p>
        <p>⛽ Gas: <b>{gasCost ?? "—"} ETH</b></p>
        <p>🧮 Total: <b>{totalCost ?? "—"} ETH</b></p>
      </div>

      <input
        className="w-full p-2 mb-3 bg-slate-700 rounded"
        placeholder="NFT Name"
        onChange={e => setName(e.target.value)}
      />

      <textarea
        className="w-full p-2 mb-3 bg-slate-700 rounded h-40"
        placeholder="Description"
        onChange={e => setDescription(e.target.value)}
      />

      {/* <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        className="w-full mb-4 bg-slate-800 p-3 rounded-lg border border-slate-600"
      >
        <option value="">Select category</option>
        <option value="Animals">Animals 🐾</option>
        <option value="Gaming">Gaming 🎮</option>
        <option value="Art">Art 🎨</option>
        <option value="Music">Music 🎵</option>
      </select> */}

      <button
        onClick={mintNFT}
        disabled={loading || !canMint}
        className={`w-full py-2 rounded font-semibold transition
          ${canMint
            ? "bg-cyan-500 hover:bg-cyan-600"
            : "bg-gray-600 cursor-not-allowed"
          }`}
      >
        {loading
          ? "Minting..."
          : canMint
            ? "Mint NFT"
            : `Cooldown ${formatTime(cooldownLeft)}`
        }
      </button>
    </div>
  )
}
