import { useState } from 'react'
import { BsCartPlus, BsEye } from 'react-icons/bs';
import { VscLoading } from 'react-icons/vsc';
import { FiEyeOff } from 'react-icons/fi';
import { BiTrash } from 'react-icons/bi';
import toast from 'react-hot-toast';
import type { IMenuItem } from '../../types';
import ConfirmModal from '../common/ConfirmModal';
import { getApiErrorMessage } from '../../utils/apiError';
import { menuAPI } from '../../services/restaurantservices/menuItemApi';
import { useAuth } from '../../hooks/useAuth';
import { cartAPI } from '../../services/restaurantservices/cartApi';

interface MenuItemsProps {
  items: IMenuItem[];
  onItemDeleted: () => void;
  isSeller: boolean;
}

function MenuItems({ items, onItemDeleted, isSeller }: MenuItemsProps) {

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  //  modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  //  open modal
  const handleDelete = (itemId: string) => {
    setSelectedItemId(itemId);
    setShowModal(true);
  };

  // confirm delete
  const confirmDelete = async () => {
    console.log("HELLO ")
    if (!selectedItemId) return;

    try {
      setLoadingItemId(selectedItemId);

      const data = await menuAPI.deleteItem(selectedItemId);
      toast.success(data?.message || "Item deleted");

      onItemDeleted();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err)|| "Delete failed");
    } finally {
      setLoadingItemId(null);
      setShowModal(false);
      setSelectedItemId(null);
    }
  };

  // toggle availability
  const toggleAvailiblity = async (itemId: string) => {
    try {
      setLoadingItemId(itemId);

      const data = await menuAPI.toggleAvailability(itemId);
      toast.success(data?.message || "Updated");

      onItemDeleted();
    } catch (error: unknown) {
      console.log(error)
      toast.error( getApiErrorMessage(error)||"Failed to update");
    } finally {
      setLoadingItemId(null);
    }
  };

  const {fetchCart} = useAuth()

  const addToCart = async(restaurantId:string,itemId:string)=>{
    try {
      const data =await cartAPI.addToCart(restaurantId,itemId)
      toast.success(data?.message)
      fetchCart()
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoadingItemId(null)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => {
          const isLoading = loadingItemId === item._id;

          return (
            <div
              key={item._id}
              className={`relative flex gap-4 rounded-lg bg-white p-4 shadow-sm transition ${!item.isAvailable ? "opacity-70" : ""}`}
            >
              <div className="relative shrink-0">
                <img
                  src={item.image}
                  alt=""
                  className={`h-20 w-20 rounded object-cover ${!item.isAvailable ? "grayscale brightness-75" : ""}`}
                />
                {!item.isAvailable && (
                  <span className="absolute inset-0 flex items-center justify-center rounded bg-black/60 text-xs font-semibold text-white">
                    Not Available
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between ">
                  <p className="font-medium">₹{item.price}</p>

                  {isSeller && (
                    <div className="flex gap-2">
                      <button
                        disabled={isLoading}
                        onClick={() => toggleAvailiblity(item._id)}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                      >
                        {isLoading ? (
                          <VscLoading size={18} className="animate-spin" />
                        ) : item.isAvailable ? (
                          <BsEye size={18} />
                        ) : (
                          <FiEyeOff size={18} />
                        )}
                      </button>

                      <button
                        disabled={isLoading}
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        {isLoading ? (
                          <VscLoading size={18} className="animate-spin" />
                        ) : (
                          <BiTrash size={18} />
                        )}
                      </button>
                    </div>
                  )}

                  {!isSeller && (
                    <button
                      disabled={!item.isAvailable || isLoading}
                      onClick={() => addToCart(item.restaurantId, item._id)}
                      className={`flex items-center cursor-pointer justify-center rounded-lg p-2 ${!item.isAvailable || isLoading
                        ? "cursor-not-allowed text-gray-400"
                        : "text-red-500 hover:bg-red-50"
                        }`}
                    >
                      {isLoading ? (
                        <VscLoading size={18} className="animate-spin" />
                      ) : (
                        <BsCartPlus size={18} />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/*  Confirm Modal */}
      <ConfirmModal
        isOpen={showModal}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </>
  );
}

export default MenuItems;