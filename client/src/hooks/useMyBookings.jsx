import { useQuery } from "@tanstack/react-query";
import useAuthValue from "./useAuthValue";
import useAxiosSecure from "./useAxiosSecure";

const useMyBookings = () => {
    const {user, loading} = useAuthValue()
    const axiosSecure = useAxiosSecure()
    const {data: myBookings = [], isLoading, isError, error, refetch} = useQuery({
        queryKey: ['my-bookings', user?.email],
        queryFn: async() => {
            const {data} = await axiosSecure.get(`/bookings`, {
                params: {email: user?.email}
            })
            return data
        },
        enabled: !!user && !loading,
        retry: 1,
        staleTime: 5 * 60 * 1000
    })


    return {myBookings, isLoading, error, isError, refetch}
};

export default useMyBookings;