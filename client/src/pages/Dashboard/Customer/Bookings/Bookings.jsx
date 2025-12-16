import { Link } from "react-router-dom";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import useMyBookings from "../../../../hooks/useMyBookings";

const Bookings = () => {
  const { error, isError, isLoading, myBookings } = useMyBookings();

  if (isError) return <p>{error?.message}</p>;

  if (isLoading) return <LoadingSpinner />;
  return (
    <div>
      <SectionTitle
        heading="My Bookings"
        subHeading="Excellence ambience"
      ></SectionTitle>
      <div className="py-7">
        <h2 className="font-semibold text-lg">
          Total Orders: {myBookings?.length}
        </h2>
        {myBookings?.length === 0 && (
          <button disabled className="btn !cursor-not-allowed ">
            <Link className="btn " to="/dashboard/reservation">
              <>
                <style>{`
                .button-wrapper::before {
                    animation: spin-gradient 4s linear infinite;
                }
            
                @keyframes spin-gradient {
                    from {
                        transform: rotate(0deg);
                    }
            
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
                <div className="relative inline-block p-0.5 rounded-full overflow-hidden hover:scale-105 transition duration-300 active:scale-100 before:content-[''] before:absolute before:inset-0 before:bg-[conic-gradient(from_0deg,_#00F5FF,_#00F5FF30,_#00F5FF)] button-wrapper">
                  <button className="relative z-10 bg-gray-800 text-white rounded-full px-8 py-3 font-medium text-sm">
                    Book Now
                  </button>
                </div>
              </>
            </Link>
          </button>
        )}

        {myBookings?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Guests</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myBookings.map((book, i) => (
                  <tr key={book._id}>
                    <th>{i + 1}</th>

                    <td>{book?.name}</td>
                    <td>
                      {new Date(book?.date).toLocaleTimeString("en-US")}
                      <br />
                      {new Date(book?.date).toLocaleDateString("en-US")}
                    </td>

                    <td>{book?.guest}</td>
                    <td>{book?.phone}</td>
                    <td>{book?.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
