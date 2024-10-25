import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { FiLogOut, FiPlus } from 'react-icons/fi'
import LinkCard from './LinkCard'
import AddLinkModal from './AddLinkModal'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'Design', label: 'Design' },
  { value: 'Database', label: 'Database' },
  { value: 'Frontend', label: 'Frontend' },
  { value: 'NoCode', label: 'NoCode' },
  { value: 'FullStack', label: 'FullStack' },
  { value: 'UI', label: 'UI' },
  { value: 'Backend', label: 'Backend' },
  { value: 'AI', label: 'AI' },
]

function Dashboard() {
  const { user } = useAuth()
  const [links, setLinks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchLinks()
  }, [selectedCategory])

  useEffect(() => {
    // Close dropdown when clicking outside of it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  async function fetchLinks() {
    let query = supabase.from('links').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

    if (selectedCategory) {
      query = query.eq('category', selectedCategory) // Filter by selected category
    }

    const { data, error } = await query

    if (error) {
      toast.error('Error fetching links')
      console.error('Error:', error)
    } else {
      setLinks(data)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/auth') // Redirect to auth page after signing out
  }

  const userName = user.email.split('@')[0]
  const capitalizedUserName = userName.charAt(0).toUpperCase() + userName.slice(1)

  return (
    <div className="h-[95vh] max-w-md mx-auto p-4 border border-gray-300 rounded-lg overflow-hidden" style={{ borderWidth: '0.3px', borderRadius: '5px' }}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
            {capitalizedUserName[0]}
          </div>
          <div>
            <h1 className="text-xl font-semibold">Hey, {capitalizedUserName}</h1>
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

      <div className="flex justify-between items-center mb-4 pt-5 pb-2">
        <h2 className="text-lg font-semibold">Medium</h2>
        <div className="flex items-center gap-2">
          <div className="relative" ref={dropdownRef}>
            <div
              className="border rounded-full bg-white text-gray-700 pl-10 pr-4 py-2 cursor-pointer flex items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ width: '150px' }} // Set a fixed width for the dropdown
            >
              <span className="absolute left-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20" className="text-gray-500">
                  <rect width="256" height="256" fill="none" />
                  <polyline points="208 96 128 176 48 96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" />
                </svg>
              </span>
              {selectedCategory ? categoryOptions.find(option => option.value === selectedCategory).label : 'Filter by'}
            </div>
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                {categoryOptions.map(option => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSelectedCategory(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-green-500 hover:text-white cursor-pointer"
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm"
          >
            <FiPlus /> Add New
          </button>
        </div>
      </div>

      {/* Container for the cards with overflow hidden and scrollable */}
      <div className="space-y-3 overflow-hidden" style={{ height: '100%', overflowY: 'auto' }}>
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
