import { useEffect } from "react";
import { useNavigate } from "react-router";

function EmailVerified() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-xl text-center">
        <div className="text-6xl mb-4">✅</div>

        <h1 className="text-3xl font-bold text-white">
          Email Verified Successfully
        </h1>

        <p className="text-gray-400 mt-3">
          Redirecting to Home...
        </p>
      </div>
    </div>
  );
}

export default EmailVerified;