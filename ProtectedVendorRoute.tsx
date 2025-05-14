import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedVendorRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("vendorlogin");
  const isVendor = localStorage.getItem("isVendor");

  if (!token || !isVendor) {
    // إعادة التوجيه إلى صفحة تسجيل الدخول إذا لم يكن المستخدم مسجلاً
    return <Navigate to="/LoginVendor" replace />;
  }

  return children;
};