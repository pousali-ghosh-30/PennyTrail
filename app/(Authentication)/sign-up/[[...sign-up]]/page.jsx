// 'use client';
// import { SignUp } from '@clerk/nextjs';

// export default function SignUpPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 p-4">
//       <div className="flex w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl bg-blue-50">

//         {/* Left - Clerk Sign Up form with blue buttons */}
//         <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center bg-white">
//           <div className="w-full max-w-sm">
//             <SignUp
//               appearance={{
//                 variables: {
//                   colorPrimary: '#3b82f6', // Tailwind blue-500
//                   colorText: '#1e3a8a',     // Blue-900 (text)
//                 },
//                 elements: {
//                   formButtonPrimary:
//                     'bg-blue-500 hover:bg-blue-600 text-white font-semibold',
//                   footerActionLink: 'text-blue-600 hover:underline',
//                 },
//               }}
//             />
//           </div>
//         </div>

//         {/* Right - Illustration */}
//         <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center p-10">
//           <img
//             src="sign_up.png"
//             alt="Sign Up Illustration"
//             className="max-w-full h-auto"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500 p-4 transition-colors duration-500">
      <div className="flex w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl bg-blue-50">
        
        {/* Right - Sign Up Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-10 bg-blue-50">
           <div className="w-full max-w-sm flex flex-col items-center">
              <img src="/Pennytrail.png" alt="Logo" className="mb-4 h-36 ml-8" />
             <div className="text-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-800">Sign Up</h2>
             </div>
            <SignUp
              routing="path"
              path="/sign-up"
              forceRedirectUrl="/dashboard"
              appearance={{
                variables: {
                  colorPrimary: '#3b82f6', 
                  colorText: '#1e3a8a',    
                },
                elements: {
                  formButtonPrimary:
                    'bg-blue-500 hover:bg-blue-600 text-white font-semibold',
                  footerActionLink: 'text-blue-600 hover:underline',
                },
              }}
            />
          </div>
        </div>

        {/* Left - Illustration */}
        <div className="hidden md:flex w-1/2 bg-blue-100 items-center justify-center p-10">
          <img
            src="/sign_up.png"
            alt="Sign Up Illustration"
            className="max-w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}