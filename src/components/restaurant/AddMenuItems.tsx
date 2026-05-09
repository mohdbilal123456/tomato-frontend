import React, { useState } from 'react'
import { BiUpload } from 'react-icons/bi'
import toast from 'react-hot-toast'
import { menuAPI } from '../../services/menuItemApi'
import { getApiErrorMessage } from '../../utils/apiError'

function AddMenuItems({ onItemAdded }: { onItemAdded: () => void }) {

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [price, setPrice] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setName("")
    setDescription("")
    setPrice("")
    setImage(null)
  }

  const handleSubmit = async () => {
    if (!name || !price || !image) {
      toast.error("Name price and Image is required")
      return;
    }

    const formData = new FormData()

    formData.append("name", name)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("file", image as File)

    try {
      setLoading(true)
      const res = await menuAPI.addItem(formData)
      console.log("RESPONSE", res)
      resetForm()
      onItemAdded();
      setLoading(false)
      toast.success(res?.message)
    } catch (error:unknown) {
      setLoading(false)
      console.log("error", error)
      setLoading(false)
      toast.error(getApiErrorMessage(error) || "Something went wrong")
    }
  }


  return (
    <>
      <div className="max-w-md space-y-4 m-auto">
        <h2 className="text-lg font-semibold">Add Menu Item</h2>
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
        />
        <textarea
          placeholder="Item description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
        />
        <input
          type="number"
          placeholder="price ₹"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
        />

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 text-sm text-gray-600 hover:bg-gray-50">
          <BiUpload className="h-5 w-5 text-red-500" />
          {image ? image.name : "Upload restaurant image"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>

        <button
          disabled={loading}
          onClick={handleSubmit}
          className="w-full rounded-lg text-white text-sm py-3 font-semibold transition bg-red-500 cursor-pointer"
        >
          {loading ? "Adding..." : "Add Item"}
        </button>
      </div>
    </>
  )
}

export default AddMenuItems
