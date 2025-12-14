/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuthValue from "../../hooks/useAuthValue";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import SectionTitle from "../SectionTitle/SectionTitle";
import ReusableForm from "../ReusableForm/ReusableForm";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
    enabled: !!isUpdate,
  });

  const formMethods = useForm({ defaultValues: isUpdate ? item : {} });
  useEffect(() => {
    formMethods.reset(isUpdate ? item : {});
  }, [isUpdate]);

  const handleSubmit = async (inputValues, reset) => {
    if (inputValues?.image?.length > 0) {
      const formData = new FormData();
      const file = inputValues?.image[0];
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CloudImageUser);
      const { data: cloud } = await axiosPublic.post(
        `https://api.cloudinary.com/v1_1/${image_hosting_key}/image/upload`,
        formData
      );
      if (!cloud.url) {
        Swal.fire({
          title: "Profile picture missing",
          text: "Please upload your profile image first.",
          icon: "warning",
        });
        return;
      }

      const { _id, ...restValues } = inputValues;
      const payload = {
        ...restValues,
        price: parseInt(inputValues.price),
        image: cloud?.url,
      };

      try {
        if (isUpdate) {
          const { data } = await axiosSecure.patch(`/menu/${id}`, payload);
          if (data?.modifiedCount) {
            Swal.fire({
              title: "Updated Successfully",
              icon: "success",
              timer: 2000,
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
            nav("/dashboard/manageItems");
            refetch();
            Swal.fire({
              title: `${inputValues?.name} added Successfully`,
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        }
      } catch (err) {
        // console.log(err);
        Swal.fire({
          title: isUpdate ? "Update failed" : "Add failed",
          text: err.message || "Something went wrong",
          icon: "error",
        });
      }
    }
  };
  if (isLoading) return <p>Loading...</p>;
  return (
    <div>
      <SectionTitle
        heading={isUpdate ? "Update Item" : "Add an Item"}
        subHeading={isUpdate ? "Wanna Change?" : "What's new?"}
      />
      <div className="bg-[#F3F3F3] mt-5 flex justify-center items-center mx-4 md:mx-12 p-4 md:p-12 rounded-lg">
        <ReusableForm
          defaultImage={isUpdate ? item.image : null}
          key={`${mode}-${id || "new"}`}
          defaultValues={isUpdate ? item : {}}
          onSubmit={(data, reset) => handleSubmit(data, reset)}
          buttonLabel={isUpdate ? "Update Item" : "Add Item"}
        />
      </div>
    </div>
  );
};

export default ItemFormPage;
