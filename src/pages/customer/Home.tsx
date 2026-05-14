import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { IRestaurant } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import RestaurantCard from '../../components/restaurant/RestaurantCard';
import Loader from '../../components/common/Loader';
import { restaurantAPI } from '../../services/restaurantservices/restaurantApi';

const Home = () => {
  const { location } = useAuth()
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [restaurants, setRestaurants] = useState<IRestaurant[]>([])
  
  const getDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return +(R * c).toFixed(2);
  };

  const getNearByRestaurant = async () => {
    if (!location) return;

    const { latitude, longitude } = location;

    if (!latitude || !longitude) return;
    const res = await restaurantAPI.getNearByRestaurant({
      params: {
        latitude: location?.latitude,
        longitude: location?.longitude,
      },
    })
    setRestaurants(res?.data);
  }

  useEffect(() => {
    const init = async () => {
      getNearByRestaurant()
    }
    init()
  }, [location, search])
  
  if (!location) {
    return <Loader/>
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6">
        {restaurants.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {restaurants.map((res) => {
              const [resLng, resLat] = res.autoLocation.coordinates;

              const distance = getDistanceKm(
                location.latitude,
                location.longitude,
                resLat,
                resLng
              );

              return (
                <RestaurantCard
                  key={res._id}
                  id={res._id}
                  name={res.name}
                  image={res.image ?? ""}
                  distance={`${distance}`}
                  isOpen={res.isOpen}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No restaurant found</p>
        )}
      </div>
    </>
  )
}

export default Home
