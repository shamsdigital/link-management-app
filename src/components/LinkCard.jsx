import React from 'react'
import { supabase } from '../lib/supabase'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

function LinkCard({ link, onDelete }) {
  async function handleDelete() {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', link.id)

    if (error) {
      toast.error('Error deleting link')
      console.error('Error:', error)
    } else {
      toast.success('Link deleted')
      onDelete()
    }
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-green-100 p-4 rounded-xl border border-green-200 hover:bg-green-50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={link.icon}
            alt={link.title}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h3 className="font-medium">{link.title}</h3>
            <p className="text-sm text-gray-600">{new URL(link.url).hostname}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleDelete()
          }}
          className="p-1 rounded-full hover:bg-green-200"
        >
          <FiX size={20} />
        </button>
      </div>
    </a>
  )
}

export default LinkCard
