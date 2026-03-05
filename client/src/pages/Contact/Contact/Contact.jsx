import { motion } from "framer-motion";
import Cover from "../../Shared/Cover/Cover";
import coverBg from "../../../assets/contact/banner.jpg";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import useScrollTo from "../../../hooks/useScrollTo";

const Contact = () => {
  useScrollTo();

  const contactInfo = [
    {
      title: "PHONE",
      content: "+38 (012) 34 56 789",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            d="M24.3287 21.1686C23.2832 20.1365 21.9781 20.1365 20.9393 21.1686C20.1469 21.9544 19.3545 22.7401 18.5754 23.5392C18.3623 23.759 18.1825 23.8056 17.9228 23.6591C17.4101 23.3794 16.864 23.153 16.3713 22.8467C14.074 21.4017 12.1495 19.5439 10.4449 17.453C9.59917 16.4142 8.84672 15.3022 8.32067 14.0503C8.21412 13.7972 8.2341 13.6308 8.44053 13.4243C9.23293 12.6586 10.0054 11.8728 10.7845 11.0871C11.8699 9.99501 11.8699 8.7165 10.7778 7.61778C10.1585 6.99185 9.53924 6.37923 8.91997 5.75329C8.28071 5.11404 7.64812 4.46812 7.0022 3.83553C5.95676 2.81672 4.65161 2.81672 3.61282 3.84219C2.81376 4.62794 2.04798 5.43366 1.2356 6.2061C0.483143 6.9186 0.103585 7.79091 0.0236787 8.80973C-0.10284 10.4678 0.303352 12.0326 0.876018 13.5575C2.04798 16.7138 3.83257 19.5172 5.99671 22.0876C8.91997 25.5635 12.4092 28.3136 16.4911 30.298C18.329 31.1903 20.2334 31.8761 22.3043 31.9893C23.7294 32.0693 24.9679 31.7097 25.9601 30.5976C26.6393 29.8385 27.4051 29.146 28.1242 28.4202C29.1896 27.3414 29.1963 26.0363 28.1375 24.9709C26.8724 23.699 25.6005 22.4338 24.3287 21.1686Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      title: "ADDRESS",
      content: "123 Gourmet St, Foodie City",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.3867 29.8013L15.48 29.8547L15.5173 29.876C15.6654 29.9561 15.831 29.998 15.9993 29.998C16.1676 29.998 16.3333 29.9561 16.4813 29.876L16.5187 29.856L16.6133 29.8013C17.1348 29.4921 17.6437 29.1621 18.1387 28.812C19.4201 27.9073 20.6174 26.889 21.716 25.7693C24.308 23.116 27 19.1293 27 14C27 11.0826 25.8411 8.28473 23.7782 6.22183C21.7153 4.15893 18.9174 3 16 3C13.0826 3 10.2847 4.15893 8.22183 6.22183C6.15893 8.28473 5 11.0826 5 14C5 19.128 7.69333 23.116 10.284 25.7693C11.3822 26.8889 12.579 27.9072 13.86 28.812C14.3554 29.1621 14.8647 29.4921 15.3867 29.8013ZM16 18C17.0609 18 18.0783 17.5786 18.8284 16.8284C19.5786 16.0783 20 15.0609 20 14C20 12.9391 19.5786 11.9217 18.8284 11.1716C18.0783 10.4214 17.0609 10 16 10C14.9391 10 13.9217 10.4214 13.1716 11.1716C12.4214 11.9217 12 12.9391 12 14C12 15.0609 12.4214 16.0783 13.1716 16.8284C13.9217 17.5786 14.9391 18 16 18Z"
            fill="white"
          />
        </svg>
      ),
    },
    {
      title: "WORKING HOURS",
      content: "Mon - Fri: 08:00 - 22:00",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 3C8.82 3 3 8.82 3 16C3 23.18 8.82 29 16 29C23.18 29 29 23.18 29 16C29 8.82 23.18 3 16 3ZM17 8C17 7.73478 16.8946 7.48043 16.7071 7.29289C16.5196 7.10536 16.2652 7 16 7C15.7348 7 15.4804 7.10536 15.2929 7.29289C15.1054 7.48043 15 7.73478 15 8V16C15 16.552 15.448 17 16 17H22C22.2652 17 22.5196 16.8946 22.7071 16.7071C22.8946 16.5196 23 16.2652 23 16C23 15.7348 22.8946 15.4804 22.7071 15.2929C22.5196 15.1054 22.2652 15 22 15H17V8Z"
            fill="white"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-base-100 min-h-screen">
      <Cover
        img={coverBg}
        title="Contact Us"
        desc="Reach us anytime! We'd love to hear from you."
      />

      <div className="app-container section-padding">
        {/* ── INFO CARDS SECTION ── */}
        <SectionTitle heading={"OUR LOCATION"} subHeading={"Visit Us"} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {contactInfo.map((info, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-2xl border border-base-300 bg-white transition-all shadow-sm hover:shadow-2xl"
            >
              {/* Gold Header */}
              <div className="bg-secondary flex justify-center py-6 transition-colors group-hover:bg-primary">
                {info.icon}
              </div>

              {/* Content */}
              <div className="p-8 text-center bg-base-200/50 m-4 rounded-xl backdrop-blur-sm">
                <h3 className="text-xl font-bold tracking-widest text-primary mb-2">
                  {info.title}
                </h3>
                <p className="text-base-content/70 font-medium">
                  {info.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── FORM SECTION ── */}
        <SectionTitle
          heading={"CONTACT FORM"}
          subHeading={"Send Us a Message"}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-16 shadow-2xl relative"
        >
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -z-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -z-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

          <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-primary tracking-wide">
                    FULL NAME*
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  className="input input-bordered bg-white/50 focus:border-secondary focus:ring-secondary/20 rounded-xl transition-all h-14"
                />
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-primary tracking-wide">
                    EMAIL ADDRESS*
                  </span>
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="input input-bordered bg-white/50 focus:border-secondary rounded-xl h-14"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-primary tracking-wide">
                  PHONE NUMBER*
                </span>
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                className="input input-bordered bg-white/50 focus:border-secondary rounded-xl h-14"
              />
            </div>

            {/* Message */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-primary tracking-wide">
                  YOUR MESSAGE*
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered bg-white/50 focus:border-secondary rounded-xl h-40 pt-4"
                placeholder="Tell us how we can help..."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="btn btn-lg bg-linear-to-r from-secondary to-[#B58130] hover:scale-105 border-none text-white px-12 rounded-full shadow-xl shadow-secondary/20 transition-all gap-3"
              >
                <span>SEND MESSAGE</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
