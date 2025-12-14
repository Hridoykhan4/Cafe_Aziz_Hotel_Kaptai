import LoadingSpinner from "../../../../components/LoadingSpinner";
import useUsers from "../../../../hooks/useUsers";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import { FaTrash, FaUser } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { data: users = [], isLoading, isError, error, refetch } = useUsers();
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: `Remove ${name} ?`,
      text: `Do you really want to remove ${name}?`,
      icon: "question",
      background: "#f0f9ff",
      color: "#0f172a",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Not Now",
      customClass: {
        popup: "rounded-2xl shadow-xl",
      },
    });

    if (result?.isConfirmed) {
      try {
        const { data } = await axiosSecure.delete(`/users/${id}`);
        if (data?.deletedCount) {
          refetch();
          Swal.fire({
            title: `Removed ${name} successfully !`,
            icon: "success",
            timer: 1800,
            showConfirmButton: false,
          });
        }
      } catch (err) {
        Swal.fire({
          title: `${err?.message || "OOpps"}`,
          text: "Something went wrong.",
          icon: "error",
        });
      }
    }
  };

  const handleMakeAdmin = async (id, name) => {
    const result = await Swal.fire({
      title: `Admin (${name})?`,
      text: `Do you really want to make ${name} as "Admin"?`,
      icon: "question",
      background: "#f0f9ff",
      color: "#0f172a",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, I want",
      cancelButtonText: "No",
      customClass: {
        popup: "rounded-2xl shadow-xl",
      },
    });

    if (result.isConfirmed) {
      try {
        const { data } = await axiosSecure.patch(`/users/admin/${id}`);
        // console.log(data);
        if (data.modifiedCount) {
          refetch();
          Swal.fire({
            title: `Updated Successfully, ${name} is now also a Admin`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (err) {
        // console.log(err);
        Swal.fire({
          title: `${err?.message || "OOpps"}`,
          text: "Something went wrong.",
          icon: "error",
        });
      }
    }
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (isError)
    return <p className="text-red-600 font-semibold text-xl">{error}</p>;

  return (
    <section>
      <div>
        <SectionTitle heading={"MANAGE ALL USERS"} subHeading={"How many??"} />
        <div className="flex justify-evenly font-semibold text-xl underline my-4">
          <h2>All Users</h2>
          <h2>Total Users: ({users?.length})</h2>
        </div>
      </div>

      {/* Main  */}
      <div>
        {users?.length === 0 ? (
          <p>No Users Found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {users?.map((user, i) => (
                  <tr key={user._id}>
                    <th>{i + 1}</th>
                    <td>{user?.name}</td>
                    <td>{user?.email}</td>
                    <td>
                      {user?.role === "admin" ? (
                        <button className="btn text-white bg-green-600">
                          Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMakeAdmin(user._id, user.name)}
                          className="btn bg-[#D1A054]"
                        >
                          <FaUser></FaUser>
                        </button>
                      )}
                    </td>

                    <th>
                      <button
                        onClick={() => handleDelete(user._id, user?.name)}
                        className="btn text-white bg-[#B91C1C]"
                      >
                        <FaTrash></FaTrash>
                      </button>
                    </th>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllUsers;
