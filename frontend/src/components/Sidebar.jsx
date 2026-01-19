import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const categories = [
  { label: "All", value: "", icon: "🌐" },
  { label: "Animals", value: "Animals", icon: "🐾" },
  { label: "Gaming", value: "Gaming", icon: "🎮" },
  { label: "Art", value: "Art", icon: "🎨" },
  { label: "Music", value: "Music", icon: "🎵" },
]

export default function Sidebar({ selected, setSelected }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex relative">

      {/* SIDEBAR */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 220, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-slate-900 border-r border-slate-700 p-4 shadow-xl overflow-y-auto h-full w-[220px]"
            >
            <h3 className="text-gray-400 text-xl mb-3 text-center">Categories</h3>

            <div className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat.value || "all"}
                  onClick={() => setSelected(cat.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition
                    ${
                      selected === cat.value
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-slate-800 hover:bg-slate-700 text-gray-300"
                    }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* TOGGLE BUTTON (OUTSIDE AnimatePresence) */}
      <button
        onClick={() => setOpen(!open)}
        className="h-12 w-6 flex items-center justify-center
                   bg-indigo-600 text-white rounded-r-md shadow-md
                   absolute top-4 -right-6 z-10"
      >
        {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </div>
  )
}
