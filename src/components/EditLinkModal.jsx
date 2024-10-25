import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

function EditLinkModal({ link, onClose, onUpdate }) {
  const [url, setUrl] = useState(link.url);
  const [title, setTitle] = useState(link.title);

  async function handleSubmit(e) {
    e.preventDefault();

    // Create a new variable for the modified URL
    let modifiedUrl = url;

    // Check if the URL starts with "http://" or "https://"
    if (!modifiedUrl.startsWith('http://') && !modifiedUrl.startsWith('https://')) {
      // If not, prepend "https://"
      modifiedUrl = 'https://' + modifiedUrl;
    }

    try {
      const { error } = await supabase
        .from('links')
        .update({ url: modifiedUrl, title })
        .eq('id', link.id);

      if (error) {
        toast.error('Error updating link');
        console.error('Error:', error);
      } else {
        toast.success('Link updated');
        onUpdate(); // Refresh the links
        onClose(); // Close the modal
      }
    } catch (error) {
      toast.error('Please enter a valid URL');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Link</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter title"
            />
          </div>
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
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditLinkModal;
