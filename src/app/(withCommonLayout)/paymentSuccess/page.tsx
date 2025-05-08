// 'use client';

// import { useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { CheckCircle } from 'lucide-react';

// const PaymentSuccessPage = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   // You might receive transaction ID or status via query params
//   const transactionId = searchParams.get('transaction_id');
//   const status = searchParams.get('status'); // e.g., 'Success', 'Failed', etc.

//   useEffect(() => {
//     // Optionally: Log or send confirmation to your server
//     if (status !== 'Success') {
//       router.push('/guest/mypurchases');
//     }
//   }, [status, router]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
//       <CheckCircle size={64} className="text-green-600 mb-4" />
//       <h1 className="text-3xl font-bold text-green-700">Payment Successful!</h1>
//       <p className="text-lg mt-2">Thank you for your subscription.</p>
//       {transactionId && (
//         <p className="text-sm mt-2 text-gray-600">
//           Transaction ID: <span className="font-medium">{transactionId}</span>
//         </p>
//       )}
//       <button
//         onClick={() => router.push('/guest')}
//         className="mt-6 px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
//       >
//         Go to Dashboard
//       </button>
//     </div>
//   );
// };

// export default PaymentSuccessPage;


import SecondaryButton from "@/components/shared/SecondaryButton";
import { Check } from "lucide-react";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="bg-green-100 p-3 rounded-full mb-5">
            <Check className="size-40 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Successful
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            Thank you for your purchase! Your payment has been processed
            successfully.
          </p>

          <Link href="/guest/mypurchases" legacyBehavior>
            <SecondaryButton>Continue Shopping</SecondaryButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
