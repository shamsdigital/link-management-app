import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { FiLogOut, FiPlus } from 'react-icons/fi'
import LinkCard from './LinkCard'
import AddLinkModal from './AddLinkModal'
import toast from 'react-hot-toast'

function Dashboard() {
  const { user } = useAuth()
  const [links, setLinks] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchLinks()
  }, [])

  async function fetchLinks() {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Error fetching links')
      console.error('Error:', error)
    } else {
      setLinks(data)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
            {user.email[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold">Hey, {user.email.split('@')[0]}</h1>
            <p className="text-sm text-gray-600">Welcome back</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FiLogOut size={20} />
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Current Links</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm"
        >
          <FiPlus /> Add New
        </button>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            onDelete={fetchLinks}
          />
        ))}
      </div>

      {showModal && (
        <AddLinkModal
          onClose={() => setShowModal(false)}
          onAdd={fetchLinks}
        />
      )}
    </div>
  )
}

export default Dashboard