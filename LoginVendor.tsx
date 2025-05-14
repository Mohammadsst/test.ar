// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axiosInstance from "../../../../api/axiosInstance";
// import { enqueueSnackbar } from "notistack";
// import ForgotPassword from "./ForgotPassword";
// interface LoginResponse {
//   message: string;
//   user: {
//     id: string;
//     email: string;
//     full_name: string;
//     phone:string,
//     address?: {
//       id: number;
//       country: string;
//       state?: string;
//       city: string;
//       postal_code?: string;
//       address_1?: string;
//       address_2?: string;
//     };
   
//   };
//   refresh: string;
//   access: string;
// }

// export default function LoginVendor() {
//   const [email, setEmail] = useState<string>("");
//   const [password, setPassword] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const handleClickOpen = () => setOpen(true);
  
//   // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
//   useEffect(() => {
//     const token = localStorage.getItem("vendorlogin");
//     const isVendor = localStorage.getItem("isVendor");
//     if (token && isVendor) {
//       navigate("/VendorDashboard");
//     }
//   }, [navigate]);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
  
//     try {
//       const response = await axiosInstance.post<LoginResponse>("account/supplier/login/", { email, password });
//       console.log("data: " ,response.data);
//       const { access, refresh ,user} = response.data;
//       if (access) {

//         localStorage.setItem("vendorlogin", access);  
//         localStorage.setItem("vendorEmail", user.email);  // ✅ Store email
//         localStorage.setItem("vendorFullName", user.full_name);  // ✅ Store full_name
//         localStorage.setItem("vendorPhone", user.phone);  // ✅ Store phone
//         localStorage.setItem("refreshVendorToken", refresh);  
//         localStorage.setItem("isVendor", "true"); 
//         if (user.address) {
//           localStorage.setItem("vendorAddress", JSON.stringify(user.address));
//         }
        
//         enqueueSnackbar("Login successful!", {
//           variant: "success",
//           anchorOrigin: { vertical: "top", horizontal: "right" },
//         });
//         navigate("/VedorDashboard");
//       } else {
//         console.log("Token is missing in response");
//       }

//     }catch (err: any) {
//       console.error("Login Failed:", err.response || err.message);
//       const errorMessage =
//         err.response?.data?.message ||
//         err.response?.data?.detail ||
//         "Failed to login. Please check your credentials.";
  
//       setError(errorMessage);
//       enqueueSnackbar(errorMessage, {
//         variant: "error",
//         anchorOrigin: { vertical: "top", horizontal: "right" },
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
//         <div className="space-y-2">
//           <h2 className="text-3xl font-bold text-center text-gray-900">VendorDashboard Login</h2>
//           <p className="text-center text-gray-600">
//             Don't have an account?{" "}
//             <Link 
//               to="/vendorsignup"
//               className="text-blue-500 hover:text-blue-600 font-medium"
//             >
//               Sign up here
//             </Link>
//           </p>
//         </div>

//         {error && (
//           <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-6">
//           <div className="space-y-2">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter your password"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-blue-500 rounded-md ${
//               loading
//                 ? "opacity-50 cursor-not-allowed"
//                 : "hover:bg-blue-600 active:bg-blue-700"
//             }`}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg
//                   className="w-5 h-5 mr-2 animate-spin"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                     fill="none"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   />
//                 </svg>
//                 Logging in...
//               </span>
//             ) : (
//               "Login"
//             )}
//           </button>
        
//           <p className="text-right text-sm">
//   <button
//     type="button"
//     onClick={handleClickOpen}
//     className="text-blue-500 hover:text-blue-600"
//   >
//     Forgot your password?
//   </button>
// </p>

// <ForgotPassword open={open} handleClose={() => setOpen(false)} />
//         </form>
//       </div>
//     </div>
    
//   );

// }
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../api/axiosInstance";
import { enqueueSnackbar } from "notistack";
import ForgotPassword from "./ForgotPassword";
import { Eye, EyeOff } from "lucide-react";
import "./Login.css"
interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    phone:string,
    address?: {
      id: number;
      country: string;
      state?: string;
      city: string;
      postal_code?: string;
      address_1?: string;
      address_2?: string;
    };
   
  };
  refresh: string;
  access: string;
}

export default function LoginVendor() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const token = localStorage.getItem("vendorlogin");
    const isVendor = localStorage.getItem("isVendor");
    if (token && isVendor) {
      navigate("/VendorDashboard");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await axiosInstance.post<LoginResponse>("account/supplier/login/", { email, password });
      console.log("data: " ,response.data);
      const { access, refresh ,user} = response.data;
      if (access) {

        localStorage.setItem("vendorlogin", access);  
        localStorage.setItem("vendorEmail", user.email);  // ✅ Store email
        localStorage.setItem("vendorFullName", user.full_name);  // ✅ Store full_name
        localStorage.setItem("vendorPhone", user.phone);  // ✅ Store phone
        localStorage.setItem("refreshVendorToken", refresh);  
        localStorage.setItem("isVendor", "true"); 
        if (user.address) {
          localStorage.setItem("vendorAddress", JSON.stringify(user.address));
        }
        
        enqueueSnackbar("Login successful!", {
          variant: "success",
          anchorOrigin: { vertical: "top", horizontal: "right" },
        });
        navigate("/VedorDashboard");
      } else {
        console.log("Token is missing in response");
      }

    }catch (err: any) {
      console.error("Login Failed:", err.response || err.message);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to login. Please check your credentials.";
  
      setError(errorMessage);
      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-center text-gray-900">VendorDashboard Login</h2>
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link 
              to="/vendorsignup"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2 relative">
  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
    Password
  </label>
  <input
    type={showPassword ? "text" : "password"}
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
    placeholder="Enter your password"
    required
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute top-9 right-3 text-gray-600 hover:text-gray-800"
    tabIndex={-1}
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-sm font-medium text-white transition-colors duration-150 bg-blue-500 rounded-md ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600 active:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 animate-spin"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        
          <p className="text-right text-sm">
  <button
    type="button"
    onClick={handleClickOpen}
    className="text-blue-500 hover:text-blue-600"
  >
    Forgot your password?
  </button>
</p>

<ForgotPassword open={open} handleClose={() => setOpen(false)} />
        </form>
      </div>
    </div>
    
  );

}