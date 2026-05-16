import { useEffect, useState } from 'react'
import type { IMenuItem, IRestaurant } from '../../types'
import AddRestaurant from '../../components/restaurant/AddRestaurant'
import Loader from '../../components/common/Loader'
import RestaurantProfile from '../../components/restaurant/RestaurantProfile'
import MenuItems from '../../components/restaurant/MenuItems'
import AddMenuItems from '../../components/restaurant/AddMenuItems'
import { restaurantAPI } from '../../services/restaurantservices/restaurantApi'
import { menuAPI } from '../../services/restaurantservices/menuItemApi'


type SellerTab = "menu" | "add-item" | "sales"

export default function Restaurant() {

  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState("menu")
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([])


  const fetchMyRestaurant = async () => {
    setLoading(true)
    const res = await restaurantAPI.fetchRestaurant()
    setRestaurant(res?.restaurant)
    setLoading(false)
  }
  useEffect(() => {
    const getRestaurant = async () => {
      fetchMyRestaurant()
    }
    getRestaurant()
  }, [])

  const fetchMenuItems = async (restaurantId: string) => {
    try {
      setLoading(true)
      const res = await menuAPI.getMenuItems(restaurantId)
      setMenuItems(res?.data?.items || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (restaurant?._id) {
      fetchMenuItems(restaurant._id)
    }
  }, [restaurant])



  if (loading) return <Loader />

  if (!restaurant) {
    return <AddRestaurant fetchMyRestaurant={fetchMyRestaurant} />
  }


  return (
    <>
      <div className='min-h-screen bg-gray-50 px-4 py-6 space-y-6 '>
        <RestaurantProfile restaurant={restaurant} isSeller={true} onUpdate={setRestaurant} />

        <div className='rounded-xl bg-white shadow-sm '>
          <div className='flex border-b'>
            {[
              { key: "menu", label: "Menu Items" },
              { key: "add-item", label: "Add Item" },
              { key: "sales", label: "Sales" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as SellerTab)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition ${tab === t.key
                  ? "border-b-2 border-red-500 text-red-500"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {t.label}
              </button>
            ))}

          </div>

          <div className="p-5">
            {tab === "menu" && (
              <MenuItems
                items={menuItems}
                onItemDeleted={() => fetchMenuItems(restaurant._id)}
                isSeller={true}
              />
            )}
            {tab === "add-item" && (
              <AddMenuItems
                onItemAdded={() => fetchMenuItems(restaurant._id)} />
            )}
            {tab === "sales" && <p>Sales Page</p>}
          </div>

        </div>
      </div>
    </>
  )
}
