import Swal from "sweetalert2";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import useAuthValue from "../../../../hooks/useAuthValue";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const Reservation = () => {
  const { user } = useAuthValue();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const handleBookTable = async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());

    const bookingInfo = {
      ...formData,
      guest: parseInt(formData.guest),
      createdAt: new Date(),
      status: "pending",
    };

    try {
      const { data } = await axiosSecure.post(`/bookings`, bookingInfo);
      if (data?.insertedId) {
        Swal.fire({
          title: "Table booked successfully 🎉",
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });

        e.target.reset();
        navigate("/dashboard/bookings");
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Booking failed",
        text: err?.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <SectionTitle subHeading="Reservation" heading="Book a table" />

      <section className="mx-auto my-6 max-w-4xl rounded-md bg-white p-6 shadow-md">
        <form onSubmit={handleBookTable}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Date */}
            <div>
              <label htmlFor="date" className="text-black">
                Date*
              </label>
              <input
                id="date"
                name="date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                required
                className="mt-2 block w-full rounded-md border border-gray-200 px-4 py-2"
              />
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="text-black">
                Time*
              </label>
              <input
                id="time"
                name="time"
                type="time"
                required
                className="mt-2 block w-full rounded-md border border-gray-200 px-4 py-2"
              />
            </div>

            {/* Guests */}
            <div>
              <label htmlFor="guest" className="text-black">
                Guest*
              </label>
              <select
                name="guest"
                id="guest"
                required
                defaultValue=""
                className="mt-2 block w-full rounded-md border border-gray-200 px-4 py-2"
              >
                <option value="" disabled>
                  Choose guest number
                </option>
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="username" className="text-black">
                Name*
              </label>
              <input
                id="username"
                name="name"
                type="text"
                readOnly
                defaultValue={user?.displayName || "Guest"}
                className="mt-2 block w-full rounded-md border border-gray-200 px-4 py-2 bg-gray-100"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="emailAddress" className="text-black">
                Email*
              </label>
              <input
                id="emailAddress"
                name="email"
                type="email"
                readOnly
                defaultValue={user?.email}
                className="mt-2 block w-full rounded-md border border-gray-200 px-4 py-2 bg-gray-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="text-black">
                Phone*
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+8801XXXXXXXXX"
                className="mt-2 block w-full rounded-md border border-gray-200 px-4 py-2"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-[#328884] px-8 py-2.5 text-white transition hover:bg-gray-600"
            >
              Book A Table
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Reservation;
