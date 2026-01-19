import { motion } from "framer-motion"
import { Hexagon } from "lucide-react"

export default function Logo() {
  return (
    <motion.div
      className="flex items-center gap-3 cursor-pointer select-none"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Icon */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="relative"
      >
        <Hexagon size={36} className="text-cyan-500" />
        <div className="absolute inset-0 blur-xl bg-indigo-500 opacity-30" />
      </motion.div>

      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-bold text-white tracking-wide">
          NFT
        </span>
        <span className="text-lg font-bold text-red-200 tracking-widest">
          MARKETPLACE
        </span>
      </div>
    </motion.div>
  )
}
