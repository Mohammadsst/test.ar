import { jwtDecode } from "jwt-decode";

export const getUser = (token: any) => {
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            // console.log("Token:", token);
            // console.log("Decoded Token:", decodedToken);

            return decodedToken;
        } catch (error) {
            console.error("Invalid token", error);
        }
    }
};
