// import SectionTitle from "../../../components/SectionTitle/SectionTitle";
// import { Swiper, SwiperSlide } from "swiper/react";
// import quotation from "../../../assets/icon/icons8-quotation.gif";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Navigation } from "swiper/modules";
// import { useEffect, useState } from "react";
// import useAxiosPublic from "../../../hooks/useAxiosPublic";

// const Testimonials = () => {
//   const [reviews, setReviews] = useState([]);
//   const axiosPublic = useAxiosPublic();
//   useEffect(() => {
//     axiosPublic(`/reviews`).then(({ data }) => setReviews(data));
//   }, [axiosPublic]);

//   return (
//     <section className="w-full max-w-7xl mx-auto mb-16 mt-16 px-4 py-10 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl overflow-hidden">
//       <SectionTitle
//         heading="Testimonials"
//         subHeading="What Our Clients Say"
//       ></SectionTitle>

//       <Swiper
//         navigation={true}
//         modules={[Navigation]}
//         className="mySwiper py-8"
//       >
//         {reviews?.map((review) => (
//           <SwiperSlide key={review?._id}>
//             <div className="flex flex-col items-center text-center px-6 py-10 bg-white/5   rounded-2xl shadow-lg backdrop-blur-lg hover:scale-[1.02] transition-transform duration-300">
//               {/* Star Ratings */}
//               <div className="flex justify-center items-center gap-1 mb-4">
//                 {[1, 2, 3, 4, 5].map((star, idx) => (
//                   <span
//                     key={idx}
//                     className={`text-2xl ${
//                       review?.rating >= star
//                         ? "text-yellow-400"
//                         : "text-gray-500"
//                     }`}
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>

//               {/* Quotation Icon */}
//               <div className="flex justify-center mb-6">
//                 <img src={quotation} alt="quotation" className="w-10 h-10" />
//               </div>

//               {/* Review Text */}
//               <p className="text-gray-200 max-w-2xl italic leading-relaxed mb-6">
//                 “{review?.details}”
//               </p>

//               {/* Reviewer Name */}
//               <h3 className="text-lg font-semibold text-orange-400 tracking-wide">
//                 — {review?.name}
//               </h3>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </section>
//   );
// };

// export default Testimonials;
