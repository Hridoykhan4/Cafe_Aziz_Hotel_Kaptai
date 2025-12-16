import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaUtensils } from "react-icons/fa";

const ReusableForm = ({
  onSubmit,
  defaultValues = {},
  defaultImage = null,
  uploading,
  buttonLabel = "Add Item",
}) => {
  const [previewImage, setPreviewImage] = useState(defaultImage);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues });
  useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  const submitHandler = (data) => {
    onSubmit(data, reset);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="w-full grid md:grid-cols-2 gap-3"
    >
      <label className="form-control w-full md:col-span-2">
        <div className="label">
          <span className="label-text">Recipe name*</span>
        </div>
        <input
          {...register("name", {
            required: `Must provide recipe name`,
            minLength: {
              value: 2,
              message: `Recipe name must be above 2 or more characters`,
            },
          })}
          type="text"
          className="input input-bordered w-full"
          placeholder="Recipe name"
        />
        {errors?.name && (
          <span className="text-red-600 ">{errors?.name?.message}</span>
        )}
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Category*</span>
        </div>
        <select
          {...register("category", {
            required: `Must select the category`,
          })}
          className="input input-bordered w-full"
        >
          <option value="">select category</option>
          <option value="salad">SALAD</option>
          <option value="pizza">Pizza</option>
          <option value="soups">Soups</option>
          <option value="desserts">Desserts</option>
          <option value="drinks">drinks</option>
        </select>
        {errors?.category && (
          <span className="text-red-600 ">{errors?.category?.message}</span>
        )}
      </label>
      <label className="form-control w-full ">
        <div className="label">
          <span className="label-text">Price*</span>
        </div>
        <input
          {...register("price", { required: true })}
          type="number"
          min={10}
          className="input input-bordered w-full "
          placeholder="Price"
        />
      </label>
      <label className="form-control w-full md:col-span-2">
        <div className="label">
          <span className="label-text">Recipe Details*</span>
        </div>
        <br />
        <textarea
          {...register("recipe", { required: true })}
          className="textarea textarea-bordered w-full"
          placeholder="Recipe Details"
        ></textarea>
      </label>
      <label className="form-control w-full md:col-span-2 flex flex-col md:flex-row items-center gap-4">
        <input
          {...register("image", {
            required: !defaultImage ? "Image is required" : false,
            validate: {
              checkFileType: (value) => {
                if (!value[0] && !defaultImage) return "Image is required";
                if (!value[0]) return true;
                const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
                return (
                  allowedTypes.includes(value[0].type) ||
                  "Only JPG, PNG or WEBP images are allowed"
                );
              },
              checkFileSize: (value) => {
                if (!value[0]) return true;
                const maxSize = 2 * 1024 * 1024;
                return (
                  value[0].size <= maxSize || "Image must be less than 2MB"
                );
              },
            },
          })}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="file-input file-input-bordered w-full max-w-xs"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setPreviewImage(URL.createObjectURL(file));
            }
          }}
        />
        {errors?.image && (
          <span className="text-red-600 ">{errors?.image?.message}</span>
        )}
        {previewImage && (
          <img
            src={previewImage}
            alt="Current"
            className="w-24 h-24 object-cover rounded-full"
          />
        )}
      </label>

      <button
        disabled={uploading}
        type="submit"
        className={`btn ${
          errors?.image?.message
            ? "bg-gray-600 cursor-not-allowed "
            : "bg-linear-to-r to-[#835D23] from-[#B58130]"
        } text-white  cursor-pointer   max-w-36`}
      >
        {uploading ? "Uploading..." : buttonLabel}
        <FaUtensils />
      </button>
    </form>
  );
};

export default ReusableForm;
