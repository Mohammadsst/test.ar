import { GoogleIcon } from "./CustomIcons";

export default function GoogleSignUp() {
    const reachGoogle = () => {
        const clientID =
            "518905232317-tq4p8h15c3hsu26lumi81u4tt8gcesnq.apps.googleusercontent.com";
        const callBackURI = "http://localhost:5173";
        window.location.replace(
            `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${callBackURI}&prompt=consent&response_type=code&client_id=${clientID}&scope=openid%20email%20profile&access_type=offline`
        );
    };
    return (
        <div className="signup-container">
            <button
                type="button"
                onClick={reachGoogle}
                className="p-3 border-2 rounded-full"
            >
                <GoogleIcon />
            </button>
        </div>
    );
}
