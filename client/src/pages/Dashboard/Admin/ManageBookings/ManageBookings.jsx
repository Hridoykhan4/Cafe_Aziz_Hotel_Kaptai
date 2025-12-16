import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import { useState } from "react";
import { FaArrowAltCircleDown, FaCheck } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { RxCross1 } from "react-icons/rx";
import Swal from "sweetalert2";

const ManageBookings = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [seeOrderItems, setSeeOrderItems] = useState({
    id: null,
    seeOrderItems: false,
  });
  const [orderedItems, setOrderItems] = useState([]);
  const { data: allBookings = [], isPending } = useQuery({
    queryKey: ["manageBookings"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/payments");
      return data;
    },
  });

  const { mutateAsync, isPending: statusPending } = useMutation({
    mutationFn: async ({ prevStatus, status, id }) => {
      if (prevStatus === status) return;
      const { data } = await axiosSecure.patch(`/order-status/${id}`, {
        status,
      });
      return data;
    },
    onError: (err) => {
      console.log(err);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["manageBookings"]);
      queryClient.invalidateQueries({ queryKey: ["payment"], exact: false });
      if (data?.modifiedCount) {
        if (data?.modifiedCount) {
          Swal.fire({
            icon: "success",
            title: "Status Updated",
            text: "Order status has been updated successfully.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
    },
  });

  const { mutate, isPending: orderPending } = useMutation({
    mutationFn: async (menuItemIds) => {
      const { data } = await axiosSecure.post(`/orderedItems`, {
        ids: menuItemIds,
      });
      return data;
    },
    onError: (error) => {
      console.log({ error });
    },
    onSuccess: (data) => {
      setOrderItems(data);
    },
  });

  const orderStatusStyle = (category) => {
    const categoryStatus = {
      confirmed: 'text-green-600',
      pending: 'text-sky-600',
      canceled: 'text-red-600',
    }
    return categoryStatus[category] || 'text-gray-600'
  }

  if (isPending) return <LoadingSpinner></LoadingSpinner>;
  return (
    <section>
      <SectionTitle heading={"Todays Bookings"} subHeading={"At a Glance!"} />
      <h1 className="text-3xl font-bold cinzelFont">
        Total Bookings: {allBookings?.length}
      </h1>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          {/* head */}
          <thead>
            <tr>
              <th className="uppercase">#</th>
              <th className="uppercase">User Email</th>
              <th className="uppercase">User Name</th>
              <th className="uppercase">Booking time</th>
              <th className="uppercase">OrderedItems</th>
              <th className="uppercase">Activity</th>
              <th className="uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {allBookings?.map((booking, i) => (
              <tr key={booking._id}>
                <th>{i + 1}</th>
                <td>{booking?.email}</td>
                <td>{booking?.name || "Guest"}</td>
                <td>
                  {new Date(booking?.createdAt).toLocaleTimeString("en-US")}
                  <br />
                  {new Date(booking?.createdAt).toLocaleDateString("en-US")}
                </td>
                <td className="flex justify-center items-center gap-2">
                  {seeOrderItems.seeOrderItems &&
                  seeOrderItems.id === booking._id ? (
                    <FcCancel
                      className="cursor-pointer btn "
                      onClick={() => {
                        setSeeOrderItems({
                          id: null,
                          seeOrderItems: false,
                        });
                        setOrderItems([]);
                      }}
                    />
                  ) : (
                    <FaArrowAltCircleDown
                      onClick={() => {
                        if (
                          seeOrderItems.id !== booking._id ||
                          !seeOrderItems.seeOrderItems
                        ) {
                          mutate(booking.menuItemIds);
                        }

                        setSeeOrderItems((prev) => ({
                          id: booking._id,
                          seeOrderItems:
                            prev.id === booking._id
                              ? !prev.seeOrderItems
                              : true,
                        }));
                      }}
                      className="text-sky-700 btn "
                    ></FaArrowAltCircleDown>
                  )}{" "}
                  ({booking?.menuItemIds?.length})
                  <br />
                  (Price: {booking?.price})
                </td>
                <td className={`${orderStatusStyle(booking.status)}`}>{booking?.status}</td>
                <td className="flex gap-4">
                  <button
                    disabled={statusPending || booking?.status === "canceled"}
                    onClick={async () => {
                      await mutateAsync({
                        prevStatus: booking?.status,
                        status: "canceled",
                        id: booking._id,
                      });
                    }}
                    className="btn text-red-500 disabled:bg-black disabled:text-gray-600"
                  >
                    <RxCross1 />
                  </button>
                  <button
                    disabled={statusPending || booking?.status === "confirmed"}
                    onClick={async () => {
                      await mutateAsync({
                        prevStatus: booking?.status,
                        status: "confirmed",
                        id: booking._id,
                      });
                    }}
                    className="btn text-green-500 disabled:bg-black disabled:text-gray-600"
                  >
                    <FaCheck />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orderPending && <LoadingSpinner></LoadingSpinner>}

      {orderedItems.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">Ordered Items</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderedItems.map((item) => (
              <div key={item._id} className="card bg-base-100 shadow-md">
                <figure className="h-52 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </figure>

                <div className="card-body">
                  <h2 className="card-title">{item.name}</h2>
                  <p>Price: ${item.price}</p>
                  <p className="text-sm text-gray-500">
                    Category: {item.category}
                  </p>
                  <p className="text-sm">{item.recipe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageBookings;
