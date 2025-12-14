import { Link, useSearchParams } from "react-router-dom";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const OrderItems = () => {
    const [searchParams] = useSearchParams();
  const axiosSecure = useAxiosSecure();

  const ids = searchParams.get("ids")?.split(",");
    const {data = [], isLoading} = useQuery({
        queryKey: ['orderItems', ids],
        queryFn: async() => {
            const {data} = await axiosSecure.post(`/orderedItems`, {ids});
            return data
        },
        enabled: !!ids?.length
    })

 
    if(isLoading) return <LoadingSpinner></LoadingSpinner>
    return (
      <div className="grid grid-cols-1 md:grid-cols-2">
        {data?.map((item) => (
          <div key={item._id} className="card bg-base-100 w-96 shadow-sm">
            <figure>
              <img src={item?.image} alt={item?.name} />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{item?.name}</h2>
              <p>
              Price: {item?.price}
              </p>
              <p>
              Category: {item?.category}
              </p>
              <p>
              Recipe: {item?.recipe}
              </p>
              <div className="card-actions justify-end">
                <Link to={`/order/${item?.category}`} className="btn btn-primary">Order Again</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
};

export default OrderItems;