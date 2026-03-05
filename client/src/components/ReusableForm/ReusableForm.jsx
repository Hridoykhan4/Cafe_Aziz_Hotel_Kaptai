import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FaUtensils,
  FaTag,
  FaDollarSign,
  FaAlignLeft,
  FaImage,
  FaCheckCircle,
} from "react-icons/fa";

const CATEGORIES = ["salad", "pizza", "soup", "dessert", "drinks"];

/* ── field wrapper ── */
const Field = ({ label, icon: Icon, error, children, span }) => (
  <div className={`flex flex-col gap-1.5 ${span ? "sm:col-span-2" : ""}`}>
    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-primary/50">
      {Icon && <Icon className="text-[10px] text-secondary" />}
      {label}
    </label>
    {children}
    {error && (
      <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
        {error}
      </p>
    )}
  </div>
);

/* ── shared input class ── */
const inputCls = (hasErr) =>
  [
    "w-full px-4 py-3 rounded-xl border text-sm text-primary placeholder:text-primary/25",
    "focus:outline-none transition-colors duration-150 bg-base-50",
    hasErr
      ? "border-red-300 focus:border-red-400"
      : "border-base-200 focus:border-secondary",
  ].join(" ");

/* ════════════════════════════════════════════ */
const ReusableForm = ({
  onSubmit,
  defaultValues = {},
  defaultImage = null,
  buttonLabel = "Add Item",
  isUpdate = false,
  uploading,
}) => {
  const [preview, setPreview] = useState(defaultImage || null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ defaultValues });

  // 1. Fix: Use a stringified dependency to prevent infinite reset loops
  const strDefaultValues = JSON.stringify(defaultValues);
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      reset(defaultValues);
      if (defaultImage) setPreview(defaultImage);
    }
  }, [strDefaultValues, reset, defaultImage]);

  /* live preview logic */
  const imageWatch = watch("image");

  // 2. Fix: Track specific properties of the file to prevent re-render loops
  const fileName = imageWatch?.[0]?.name;

  useEffect(() => {
    let objectUrl;

    // Check if we actually have a FILE (not just a string URL from the DB)
    if (imageWatch && imageWatch[0] instanceof File) {
      objectUrl = URL.createObjectURL(imageWatch[0]);
      setPreview(objectUrl);
    } else if (typeof defaultImage === "string" && !imageWatch?.[0]) {
      // If we're updating and haven't picked a NEW file yet, show the OLD image
      setPreview(defaultImage);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageWatch, defaultImage]); // Dependency on the whole watch object is safer here

  const submitHandler = async (data) => {
    setSubmitting(true);
    try {
      await onSubmit(data, reset);
    } catch (err) {
      console.error("Form submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      {/* Name */}
      <Field
        label="Recipe Name"
        icon={FaUtensils}
        error={errors?.name?.message}
        span
      >
        <input
          {...register("name", {
            required: "Recipe name is required",
            minLength: { value: 2, message: "Must be at least 2 characters" },
          })}
          type="text"
          placeholder="e.g. Grilled Chicken Caesar"
          className={inputCls(!!errors?.name)}
        />
      </Field>

      {/* Category */}
      <Field label="Category" icon={FaTag} error={errors?.category?.message}>
        <select
          {...register("category", { required: "Please select a category" })}
          className={inputCls(!!errors?.category)}
        >
          <option value="">Select category…</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="capitalize">
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </Field>

      {/* Price */}
      <Field
        label="Price (USD)"
        icon={FaDollarSign}
        error={errors?.price?.message}
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-black text-sm pointer-events-none">
            $
          </span>
          <input
            {...register("price", {
              required: "Price is required",
              min: { value: 1, message: "Must be at least $1" },
            })}
            type="number"
            step="0.01"
            placeholder="0"
            className={`${inputCls(!!errors?.price)} pl-8`}
          />
        </div>
      </Field>

      {/* Recipe details */}
      <Field
        label="Recipe Details"
        icon={FaAlignLeft}
        error={errors?.recipe?.message}
        span
      >
        <textarea
          {...register("recipe", { required: "Recipe details are required" })}
          rows={4}
          placeholder="Describe ingredients, preparation method, serving size…"
          className={`${inputCls(!!errors?.recipe)} resize-none`}
        />
      </Field>

      {/* Image upload */}
      <Field
        label="Food Image"
        icon={FaImage}
        error={errors?.image?.message}
        span
      >
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label
            htmlFor="food-image"
            className={[
              "flex-1 flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
              errors?.image
                ? "border-red-300 bg-red-50/50"
                : "border-base-300 hover:border-secondary hover:bg-secondary/5",
            ].join(" ")}
          >
            <FaImage className="text-2xl text-primary/20" />
            <div className="text-center">
              <p className="text-xs font-bold text-primary/50">
                {imageWatch?.[0] ? imageWatch[0].name : "Click to upload"}
              </p>
              <p className="text-[10px] text-primary/30 mt-0.5">
                JPG, PNG or WEBP · Max 2MB
              </p>
            </div>
            <input
              id="food-image"
              {...register("image", {
                required:
                  !isUpdate && !defaultImage ? "Image is required" : false,
                validate: {
                  type: (v) => {
                    if (!v || !v[0]) return true;
                    return (
                      ["image/jpeg", "image/png", "image/webp"].includes(
                        v[0].type,
                      ) || "Only JPG, PNG, WEBP"
                    );
                  },
                  size: (v) => {
                    if (!v || !v[0]) return true;
                    return (
                      v[0].size <= 2 * 1024 * 1024 || "Max file size is 2MB"
                    );
                  },
                },
              })}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />
          </label>

          {/* preview */}
          {preview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border-2 border-secondary/30 shadow-md"
            >
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-secondary/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <FaCheckCircle className="text-secondary text-xl" />
              </div>
            </motion.div>
          )}
        </div>
      </Field>

      {/* Submit */}
      <div className="sm:col-span-2 pt-2">
        <button
          type="submit"
          disabled={submitting || uploading}
          className={[
            "inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-black text-sm tracking-widest uppercase text-white transition-all duration-200 active:scale-95",
            submitting || uploading
              ? "bg-primary/30 cursor-not-allowed"
              : isUpdate
                ? "bg-amber-600 hover:bg-amber-700 shadow-lg"
                : "bg-secondary hover:bg-secondary/90 shadow-lg",
          ].join(" ")}
        >
          <FaUtensils className={submitting ? "animate-spin" : ""} />
          {submitting ? "Saving..." : buttonLabel}
        </button>
      </div>
    </form>
  );
};

export default ReusableForm;
