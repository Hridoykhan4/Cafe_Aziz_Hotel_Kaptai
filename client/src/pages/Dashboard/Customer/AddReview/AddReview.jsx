import { FaFly, FaRegStar, FaStar } from "react-icons/fa";
import SectionTitle from "../../../../components/SectionTitle/SectionTitle";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuthValue from "../../../../hooks/useAuthValue";
import { useNavigate } from "react-router-dom";

const AddReview = () => {
  const [starCount, setStarCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const axiosSecure = useAxiosSecure();
  const { user } = useAuthValue();
  const navigate = useNavigate();

  const handleReview = async (e) => {
    e.preventDefault();

    if (!user) {
      return Swal.fire({
        title: "Login required",
        text: "Please login to submit a review",
        icon: "warning",
      });
    }

    if (starCount === 0) {
      return Swal.fire({
        title: "Please rate us",
        icon: "error",
      });
    }

    const { suggestion, review } = Object.fromEntries(
      new FormData(e.target).entries()
    );

    const reviewInfo = {
      details: review?.trim() || "No detailed review provided",
      suggestion: suggestion?.trim() || "No suggestion provided",
      rating: starCount,
      name: user.displayName,
      email: user.email,
    };

    try {
      setLoading(true);

      const { data } = await axiosSecure.post("/reviews", reviewInfo);

      if (data?.insertedId) {
        Swal.fire({
          title: "Thanks for your review ❤️",
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });

        e.target.reset();
        setStarCount(0);

        navigate("/dashboard/userHome");
      }
    } catch (err) {
      Swal.fire({
        title: "Submission failed",
        text: err?.message || "Something went wrong",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionTitle subHeading="Sharing is caring" heading="Give a review" />

      <div className="mx-auto mt-4 max-w-lg rounded-lg bg-gray-200/40 p-6">
        <h2 className="mb-4 text-center text-lg font-medium uppercase sm:text-xl">
          Rate Us!
        </h2>

        {/* Star Rating */}
        <div className="flex justify-center gap-3">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStarCount(i + 1)}
              aria-label={`Rate ${i + 1} star`}
            >
              {i < starCount ? (
                <FaStar className="text-xl text-orange-500" />
              ) : (
                <FaRegStar className="text-xl text-gray-500" />
              )}
            </button>
          ))}
        </div>

        {starCount > 0 && (
          <p className="my-3 text-center text-sm text-gray-600">
            You rated {starCount} out of 5
          </p>
        )}

        {/* Review Form */}
        <form onSubmit={handleReview} className="space-y-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Do you have any suggestion for us?
            </legend>
            <textarea
              name="suggestion"
              className="textarea h-24 w-full"
              placeholder="Suggestions (optional)"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Kindly express your experience shortly
            </legend>
            <textarea
              name="review"
              className="textarea h-24 w-full"
              placeholder="Your review"
            />
          </fieldset>

          <button
            type="submit"
            disabled={loading}
            className={`btn max-w-40 text-white ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-linear-to-r from-[#B58130] to-[#835D23]"
            }`}
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                <FaFly /> Send Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReview;
