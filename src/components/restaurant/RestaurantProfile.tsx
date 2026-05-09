import React, { useState } from 'react'
import { BiEdit, BiMapPin, BiSave } from 'react-icons/bi'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { restaurantAPI } from '../../services/restaurantApi';
import { authAPI } from '../../services/authApi';
import type { IRestaurant } from '../../types';
import { getApiErrorMessage } from '../../utils/apiError';



interface props {
  restaurant: IRestaurant;
  isSeller: boolean;
  onUpdate: (restaurant: IRestaurant) => void;
}
function RestaurantProfile({ restaurant, isSeller, onUpdate }: props) {

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(restaurant.name);
  const [description, setDescription] = useState(restaurant.description);
  const [isOpen, setIsOpen] = useState(restaurant.isOpen);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const toggleOpenStatus = async () => {
    try {
      await restaurantAPI.updateRestaurantStatus(!isOpen)
      setIsOpen(!isOpen)
      onUpdate({ ...restaurant, isOpen: !isOpen })
    } catch (error) {
      console.log(error)
    }
  }

  const saveChanges = async () => {
    try {
      setLoading(true);

      const payload = {
        name,
        description,
      };

      const res = await restaurantAPI.updateRestaurantService(payload);

      const updatedRestaurant = res?.data?.restaurant;

      setName(updatedRestaurant.name);
      setDescription(updatedRestaurant.description);

      // UI sync fix
      onUpdate(updatedRestaurant);

      setEditMode(false);

      toast.success("Updated successfully");
    } catch (error: unknown) {
      console.log(error);
      toast.error(getApiErrorMessage(error)|| "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const logOutHandler = async () => {
    try {
      setLoading(true)
      const res = await authAPI.logOut()
      console.log(res)
      toast.success(res?.message)
      setUser(null)
      navigate("/login")
      setLoading(false)

    } catch (error: unknown) {
      setLoading(false)
      toast.error(getApiErrorMessage(error) || "Error occurred")
    }
  }

  return (
    <>
      <div className="mx-auto max-w-xl rounded-xl bg-white shadow-sm overflow-hidden">
        {restaurant.image && (
          <img
            src={restaurant.image}
            alt=""
            className="h-48 w-full object-cover"
          />
        )}
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              {editMode ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border px-2 py-1 text-lg font-semibold"
                />
              ) : (
                <h2 className="text-xl font-semibold">{restaurant.name}</h2>
              )}

              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                <BiMapPin className="h-4 w-4 text-red-500" />
                {restaurant.autoLocation.formattedAddress ||
                  "Location unavalable"}
              </div>
            </div>

            {isSeller && (
              <button
                onClick={() => setEditMode(!editMode)}
                className="text-gray-500 hover:text-black"
              >
                <BiEdit size={18} className='cursor-pointer' />
              </button>
            )}
          </div>

          {editMode ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border px-3 py-2 text-sm"
            />
          ) : (
            <p className="text-sm text-gray-600">
              {restaurant.description || "No description added"}
            </p>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <span
              className={`text-sm font-medium ${isOpen ? "text-green-600" : "text-red-500"
                }`}
            >
              {isOpen ? "OPEN" : "CLOSED"}
            </span>

            <div className="flex gap-3">
              {editMode && (
                <button
                  onClick={saveChanges}
                  disabled={loading}
                  className="flex items-center gap-1  cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                >
                  <BiSave size={16} className='cursor-pointer' />
                  Save
                </button>
              )}

              {isSeller && (
                <button
                  onClick={toggleOpenStatus}
                  className={`rounded-lg px-4 py-1.5 text-sm cursor-pointer font-medium text-white ${isOpen
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {isOpen ? "Close Restaurant" : "Open Restaurant"}
                </button>
              )}

              {isSeller && (
                <button
                  onClick={logOutHandler}
                  className={`rounded-lg px-4 py-1.5 text-sm cursor-pointer font-medium text-white bg-red-600 hover:bg-red-700
                `}
                >
                  Logout
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Created on {new Date(restaurant.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  )
}

export default RestaurantProfile