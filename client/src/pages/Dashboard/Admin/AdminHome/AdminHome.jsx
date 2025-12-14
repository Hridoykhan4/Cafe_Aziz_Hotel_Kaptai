import { Helmet } from "react-helmet-async";
import useAuthValue from "../../../../hooks/useAuthValue";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const AdminHome = () => {
    const {user} = useAuthValue();
    const axiosSecure = useAxiosSecure()
    const {data: stats = {}, isPending} = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async() => {
            const {data} = await axiosSecure('/admin-stats')
            return data
        }
    })

    console.log(stats);

    if(isPending) return <LoadingSpinner></LoadingSpinner>
    return (
        <div>
            <Helmet>
                    <title>Bistro | Admin Home</title>
                  </Helmet>
            <h2 className="text-lg font-semibold">Hi, {user?.displayName || 'Guest'}</h2>

        </div>
    );
};

export default AdminHome;