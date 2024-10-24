import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

function AddLinkModal({ onClose, onAdd }) {
  const [url, setUrl] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    // Create a new variable for the modified URL
    let modifiedUrl = url

    // Check if the URL starts with "http://" or "https://"
    if (!modifiedUrl.startsWith('http://') && !modifiedUrl.startsWith('https://')) {
      // If not, prepend "https://"
      modifiedUrl = 'https://' + modifiedUrl
    }

    // Remove "https://" if it was added by the user
    const sanitizedUrl = modifiedUrl.replace(/^https:\/\//, '')

    if (!sanitizedUrl) {
      toast.error('Please fill the URL field')
      return
    }

    try {
      const urlObj = new URL(modifiedUrl)
      const icon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`
      const title = urlObj.hostname // Set title based on the URL

      const { error } = await supabase
        .from('links')
        .insert([{ 
          title, 
          url: modifiedUrl,
          icon,
          user_id: (await supabase.auth.getUser()).data.user.id
        }])

      if (error) {
        toast.error('Error adding link')
        console.error('Error:', error)
      } else {
        toast.success('Link added')
        onAdd()
        onClose()
      }
    } catch (error) {
      toast.error('Please enter a valid URL')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Link</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter URL"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddLinkModal
