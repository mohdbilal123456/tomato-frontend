import { useEffect, useState } from 'react'
import RestaurantProfile from '../../components/restaurant/RestaurantProfile'
import MenuItems from '../../components/restaurant/MenuItems'
import { useParams } from 'react-router-dom';
import type { IMenuItem, IRestaurant } from '../../types';
import { restaurantAPI } from '../../services/restaurantservices/restaurantApi';
import { menuAPI } from '../../services/restaurantservices/menuItemApi';
import Loader from '../../components/common/Loader';

function RestaurantDetails() {

  const { id } = useParams();

  const [restaurant, setRestaurant] = useState<IRestaurant | null>(null);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {

        setLoading(true);

        if (!id) return;

        // Restaurant Fetch
        const restaurantRes =
          await restaurantAPI.fetchSingleRestaurant(id);

        setRestaurant(restaurantRes?.data);

        // Menu Fetch
        const menuRes = await menuAPI.getMenuItems(id);

        setMenuItems(menuRes?.data?.items || []);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    };

    fetchData();

  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          No Restaurant with this id
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 space-y-6">

      <RestaurantProfile
        restaurant={restaurant}
        onUpdate={setRestaurant}
        isSeller={false}
      />

      <div className="rounded-xl bg-white shadow-sm p-4">
        <MenuItems
          isSeller={false}
          items={menuItems}
          onItemDeleted={() => { }}
        />
      </div>

    </div>
  )
}

export default RestaurantDetails