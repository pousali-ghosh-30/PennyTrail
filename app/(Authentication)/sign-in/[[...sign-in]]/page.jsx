'use client';
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 p-4 transition-colors duration-500">
      <div className="flex w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl bg-blue-50">
        
        {/* Left - Illustration */}
        <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center p-10">
          <img
            src="/sign_in.png" // <- Make sure this matches the actual filename
            alt="Welcome Illustration"
            className="max-w-full h-auto object-contain"
          />
        </div>

        {/* Right - Sign In Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 bg-blue-50">
          <div className="w-full max-w-sm flex flex-col items-center">
            <img src="/PennyTrail.png" alt="Logo" className="mb-4 h-36 ml-8" />
            <div className="text-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-800">Sign In</h2>
            </div>

            <SignIn
              routing="path"
              path="/sign-in"
              forceRedirectUrl="/dashboard"
              appearance={{
                elements: {
                  card: "bg-transparent shadow-none p-0",
                  formFieldInput:
                    "bg-gray-100 border border-gray-300 text-gray-800 rounded-lg px-4 py-2 mb-4 w-full",
                  formButtonPrimary:
                    "bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg w-full",
                  socialButtonsBlockButton:
                    "bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 mb-3 w-full border border-gray-300 text-gray-700",
                },
                variables: {
                  colorPrimary: "#3b82f6", // blue-500
                }
              }}
            />

            <p className="text-xs text-center text-gray-400 mt-4">
              By creating an account you agree to our{" "}
              <a href="#" className="text-blue-600 font-medium">Terms of Service</a> and{" "}
              <a href="#" className="text-blue-600 font-medium">Privacy Policy</a>.
            </p>

            <p className="text-sm text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <a href="/sign-in" className="text-blue-600 font-semibold hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}