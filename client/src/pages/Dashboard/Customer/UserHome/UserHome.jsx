import { Helmet } from "react-helmet-async";
import useAuthValue from "../../../../hooks/useAuthValue";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const UserHome = () => {
    const {user} = useAuthValue()
  return (
    <div>
      <Helmet>
        <title>Bistro | User Dashboard</title>
      </Helmet>
     <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800">
                Welcome back, {user?.displayName || "Admin"} 👋
              </h1>
            
            </div>
          </motion.div>

        



    </div>
  );
};

export default UserHome;
