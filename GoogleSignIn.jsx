import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
const GoogleSignIn = () => {
  const clientId = "681470544682-ne3snm59o7bo8ti5qjp6b23k19dueeec.apps.googleusercontent.com"; // Replace with your Google Client ID
  const navigate = useNavigate();
  const onSuccess = async (response) => {
    console.log("Google Login Success:", response);
    const tokenId = response.credential;
    // Send the token to the backend
    try {
      const res = await fetch("http://127.0.0.1:8000/en/api/account/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: tokenId }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Backend Response:", data);
        // Store tokens and user info in localStorage or context
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        console.log("User Info:", data.user);
        navigate("/");
      } else {
        const errorData = await res.json();
        console.error("Login failed:", errorData);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const onError = (error) => {
    console.error("Google Login Failed:", error);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div>
        <GoogleLogin onSuccess={onSuccess} onError={onError} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;