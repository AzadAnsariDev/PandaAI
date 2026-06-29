import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Theme tokens - keep these in sync with your Dashboard theme variables
const darkTheme = {
  '--bg-primary': '#14161a',
  '--bg-secondary': '#1b1e22',
  '--border': '#2a2f36',
  '--text-primary': '#ece9e4',
  '--text-secondary': '#8b8f96',
  '--accent': '#22BFA8',
};

function EmailVerified() {
  const navigate = useNavigate();
  const [isDark] = useState(true); // flip to false to preview the light theme

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={darkTheme}
      className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center px-4"
    >
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8 text-center max-w-sm w-full shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-[var(--accent)] flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Email Verified Successfully
        </h1>

        <p className="text-[var(--text-secondary)] mt-3 text-sm">
          Redirecting to Home...
        </p>
      </div>
    </div>
  );
}

export default EmailVerified;