import { useQuery } from "@tanstack/react-query";
import useAuthValue from "../../../../hooks/useAuthValue";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import { FaArrowRight, FaCross } from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FcCancel } from "react-icons/fc";
import { useState } from "react";

const PaymentHistory = () => {
  const location = useLocation();
  const isOpen = location.pathname.includes("menuIds");
  const [isOpenMatchedId, setIdOpenMatchedId] = useState(null);
  const { user, loading } = useAuthValue();
  const axiosSecure = useAxiosSecure();
  const { data: payments = [], isPending } = useQuery({
    queryKey: ["payment", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/payments?email=${user?.email}`);
      // console.log(data);
      return data;
    },
    enabled: !!user && !loading,
    refetchInterval: 4000,
  });

  if (isPending) return <LoadingSpinner></LoadingSpinner>;
  return (
    <div>
      <SectionTitle heading={"PAYMENT HISTORY"} subHeading={"At a Glance!"} />
      <h1 className="text-3xl font-bold cinzelFont">
        Total Payments: {payments?.length}
      </h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Items</th>
              <th>Order Items</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((history, i) => (
              <tr key={history._id}>
                <th>{i + 1}</th>
                <td>{history?.email}</td>
                <td>{history?.price}</td>
                <td>{history?.status}</td>
                <td>
                  {new Date(history?.createdAt).toLocaleTimeString("en-US")}
                  <br />
                  {new Date(history?.createdAt).toLocaleDateString("en-US")}
                </td>
                <td>{history?.menuItemIds?.length}</td>
                <td onClick={() => setIdOpenMatchedId(history._id)}>
                  <Link
                    className="btn"
                    to={
                      isOpen
                        ? "/dashboard/payment_history"
                        : `menuIds?ids=${history.menuItemIds.join(",")}`
                    }
                  >
                    {isOpen && history._id === isOpenMatchedId ? (
                      <FcCancel></FcCancel>
                    ) : (
                      <FaArrowRight className="text-sky-700 text-lg"></FaArrowRight>
                    )}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        <div className="mt-10">
          <Outlet></Outlet>
        </div>
    </div>
  );
};

export default PaymentHistory;
