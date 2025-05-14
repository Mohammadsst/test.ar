
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
const GoogleAuth = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const handleCallbackResponse = async (response) => {
        try {
            const res = await fetch('http://127.0.0.1:8000/en/api/authenticate/google/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    auth_token: response.credential,
                }),
            });

            if (!res.ok) {
                throw new Error('Authentication failed.');
            }

            const data = await res.json();
            console.log('User data:', data);
            setUserData(data.data); // Save user data to state
            localStorage.setItem('accessToken', data.data.tokens.access);
            localStorage.setItem('email', data.data.email);
            navigate("/");
            // alert('Login successful!');
        } catch (error) {
            console.error('Error during authentication:', error);
            alert('Google login failed. Please try again.');
        }
    };

    React.useEffect(() => {
        /* Load Google script */
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.google.accounts.id.initialize({
                client_id:"681470544682-ne3snm59o7bo8ti5qjp6b23k19dueeec.apps.googleusercontent.com",
                callback: handleCallbackResponse,
            });
            window.google.accounts.id.renderButton(
                document.getElementById('signInDiv'),
                {
                    theme: 'outline',
                    size: 'large',
                }
            );
        };
    }, []);

    return (
        <>
        <div>
            <div id="signInDiv"></div>
        </div>
      </>
    );
};

export default GoogleAuth;
