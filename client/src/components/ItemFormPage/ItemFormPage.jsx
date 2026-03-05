import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuthValue from "../../hooks/useAuthValue";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import ReusableForm from "../ReusableForm/ReusableForm";
import { motion } from "framer-motion";
import { FaPlus, FaEdit } from "react-icons/fa";
import LoadingSpinner from "../LoadingSpinner";

const image_hosting_key = import.meta.env.VITE_Cloudinary_Image_Hosting_key;

const ItemFormPage = ({ mode = "add" }) => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();
  const { user } = useAuthValue();
  const nav = useNavigate();
  const isUpdate = mode === "update";

  const {
    data: item = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const { data } = await axiosSecure(`/menu/${id}`);
      return data;
    },
    staleTime: 0,
    enabled: !!isUpdate && !!id,
  });

  /* NOTE: I removed 'useForm' and 'useEffect(reset)' from here. 
     The ReusableForm component manages its own internal state. 
     The 'key' prop on ReusableForm below handles the data syncing.
  */

  const handleSubmit = async (inputValues, reset) => {
    if (!inputValues?.image?.length && !isUpdate) {
      Swal.fire({ title: "Image required", icon: "warning" });
      return;
    }

    let imageUrl = item?.image || "";

    if (inputValues?.image?.length > 0) {
      const formData = new FormData();
      formData.append("file", inputValues.image[0]);
      formData.append("upload_preset", import.meta.env.VITE_CloudImageUser);

      try {
        const { data: cloud } = await axiosPublic.post(
          `https://api.cloudinary.com/v1_1/${image_hosting_key}/image/upload`,
          formData
        );

        if (!cloud?.url) {
          Swal.fire({ title: "Image upload failed", icon: "error" });
          return;
        }
        imageUrl = cloud.url;
      } catch (err) {
        Swal.fire({ title: "Cloudinary upload error", text: err.message, icon: "error" });
        return;
      }
    }

    const { _id, ...restValues } = inputValues;
    const payload = {
      ...restValues,
      price: parseFloat(inputValues.price), // Using parseFloat to handle decimals safely
      image: imageUrl,
    };

    try {
      if (isUpdate) {
        const { data } = await axiosSecure.patch(`/menu/${id}`, payload);
        if (data?.modifiedCount > 0 || data?.matchedCount > 0) {
          Swal.fire({
            title: "Updated!",
            icon: "success",
            timer: 1800,
            showConfirmButton: false,
          });
          refetch();
          nav("/dashboard/manageItems");
        }
      } else {
        const { data } = await axiosSecure.post(
          `/menu?email=${user?.email}`,
          payload
        );
        if (data?.insertedId) {
          reset();
          Swal.fire({
            title: `${inputValues.name} added!`,
            icon: "success",
            timer: 1800,
            showConfirmButton: false,
          });
          nav("/dashboard/manageItems");
        }
      }
    } catch (err) {
      Swal.fire({
        title: "Something went wrong",
        text: err.message,
        icon: "error",
      });
    }
  };

  if (isLoading && isUpdate) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-secondary mb-1">
          Menu Management
        </p>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
            style={{ background: isUpdate ? "#d9770618" : "#05966918" }}
          >
            {isUpdate ? (
              <FaEdit className="text-base" style={{ color: "#d97706" }} />
            ) : (
              <FaPlus className="text-base" style={{ color: "#059669" }} />
            )}
          </div>
          <h1
            className="text-2xl font-black text-primary tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {isUpdate ? "Update Item" : "Add New Item"}
          </h1>
        </div>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, delay: 0.08 }}
        className="bg-white rounded-2xl border border-base-200 p-5 sm:p-8"
      >
        <ReusableForm
          /* Critical Fix: Changing the key forces a clean re-mount when item data loads,
            preventing the need for a useEffect reset that causes loops.
          */
          key={isUpdate ? `update-${item?._id || id}` : "add-new"}
          defaultValues={isUpdate ? item : {}}
          defaultImage={isUpdate ? item.image : null}
          onSubmit={handleSubmit}
          buttonLabel={isUpdate ? "Update Item" : "Add Item"}
          isUpdate={isUpdate}
        />
      </motion.div>
    </div>
  );
};

export default ItemFormPage;