import { useEffect, useState } from "react"
import { ethers } from "ethers"
import axios from "axios"
import { motion } from "framer-motion"

export default function Home() {

  /* =================== UI =================== */
  return (
    <div className="pt-24 min-h-screen">
      <div className="Home-header flex-1" >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              textShadow: [
                "0 0 10px rgba(99,102,241,0.4)",
                "0 0 20px rgba(168,85,247,0.6)",
                "0 0 10px rgba(99,102,241,0.4)",
              ],
            }}
            className="
              text-3xl md:text-5xl font-extrabold mb-4 ml-10 text-center
              bg-clip-text text-cyan-300
            "
          >
            Home
          </motion.h2>


            <motion.p
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-emerald-400 mr-10"
              style={{textAlign:"right"}}
            >
            </motion.p>
      </div>
      <hr />
    </div>
  )
}
