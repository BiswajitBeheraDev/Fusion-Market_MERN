"use client";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccess = async (credentialResponse: any) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credentialResponse.credential, 
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        console.log("Login Success! User saved in DB.");
        router.push("/dashboard"); // Redirect to dashboard
      } else {
        alert("Backend verification failed!");
      }
    } catch (err) {
      console.error("Error connecting to backend:", err);
      alert("Backend server nahi chal raha!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-10 bg-white shadow-xl rounded-2xl text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Signup / Login</h1>
        <p className="text-gray-500 mb-8">One click mein Google se account banayein</p>
        
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Login Failed")}
          />
        </div>
      </div>
    </div>
  );
}