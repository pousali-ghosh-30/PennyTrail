// 'use client';

// import { UserButton, useUser } from '@clerk/nextjs';
// import React, { useEffect, useState } from 'react';
// import { Bell } from 'lucide-react';
// import Link from 'next/link';

// function DashboardHeader() {
//   const { isSignedIn } = useUser();
//   const [notificationCount, setNotificationCount] = useState(0);

//   useEffect(() => {
//     const fetchNotificationCount = async () => {
//       try {
//         const res = await fetch('/api/transaction-count');
//         const data = await res.json();
//         // if(data.count !== notificationCount) {
//         //         // Count changed, reload the page
//         //     window.location.reload();
//         // }
//         setNotificationCount(data.count || 0);
//       } catch (err) {
//         console.error('Error fetching transaction count:', err);
//       }
//     };

//     if (isSignedIn) {
//       fetchNotificationCount();
//     }
//   }, [isSignedIn]);

//   return (
//     <div className="p-5 shadow-sm border-b flex justify-between items-center">
//       <div></div>

//       <div className="flex items-center gap-4">
//         {notificationCount > 0 && (
//           <Link href="/dashboard/notifications" className="relative">
//             <Bell className="w-6 h-6 text-gray-600 hover:text-purple-600 cursor-pointer" />
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
//               {notificationCount}
//             </span>
//           </Link>
//         )}

//         <UserButton />
//       </div>
//     </div>
//   );
// }

// export default DashboardHeader;

'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';

function DashboardHeader() {
  const { isSignedIn } = useUser();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    let interval;

    const fetchNotificationCount = async () => {
      try {
        const res = await fetch('/api/transaction-count');
        const data = await res.json();
        setNotificationCount(data.count || 0);
      } catch (err) {
        console.error('Error fetching transaction count:', err);
      }
    };

    if (isSignedIn) {
      fetchNotificationCount();
      interval = setInterval(fetchNotificationCount, 2000); // Auto-refresh every 2s
    }

    return () => clearInterval(interval);
  }, [isSignedIn]);

  return (
    <div className="p-5 shadow-sm border-b flex justify-between items-center">
      <div></div>

      <div className="flex items-center gap-4">
        <Link href="/dashboard/notifications" className="relative">
          <Bell className="w-6 h-6 text-gray-600 hover:text-purple-600 cursor-pointer" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
              {notificationCount}
            </span>
          )}
        </Link>

        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader;
