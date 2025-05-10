"use client";
import { getPayment } from "@/services/Payment";
import React, { useEffect, useState } from "react";
import { Check, Clock, Copy, AlertCircle, Loader2 } from "lucide-react";
import SecondaryButton from "@/components/shared/SecondaryButton";
import Link from "next/link";

interface PaymentData {
  id: string;
  email: string;
  amount: number;
  status: string;
  transactionId: string;
  userId: string;
  createdAt: string;
}

const PaymentDetails = () => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);


  useEffect(() => {
    const fetchPayment = async () => {
      setIsLoading(true);

      try {
        const data = await getPayment();
        if (data.success && Array.isArray(data.data)) {
          setPaymentInfo(data.data);
        }
      } catch (error) {
        console.error("Error fetching payment:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayment();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
      case "COMPLETEED": // typo support
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
      case "COMPLETEED":
        return <Check size={16} className="text-green-600" />;
      case "PENDING":
        return <Clock size={16} className="text-yellow-600" />;
      case "FAILED":
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center space-y-2">
          <Loader2 size={24} className="animate-spin text-blue-600" />
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!paymentInfo.length) {
    return (
      <div className="bg-white rounded-lg shadow-md max-w-md mx-auto p-6 text-center">
        <AlertCircle size={24} className="text-yellow-600 mx-auto mb-2" />
        <h2 className="text-lg font-medium text-gray-900">No Payment Found</h2>
        <p className="text-gray-600 mt-1">
          We could not find any payment information for your account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {paymentInfo.map((payment) => {
        const formattedDate = new Date(payment.createdAt).toLocaleString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        );

        return (
          <div
            key={payment.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="bg-purple-700 px-6 py-4">
              <h2 className="text-white text-xl font-semibold">
                Payment Details
              </h2>
            </div>

            <div className="flex items-center justify-between px-6 py-3 bg-blue-50 border-b border-blue-100">
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    payment.status
                  )}`}
                >
                  {getStatusIcon(payment.status)}
                  <span className="ml-1">
                    {payment.status === "COMPLETEED"
                      ? "COMPLETED"
                      : payment.status}
                  </span>
                </span>
              </div>
              <span className="text-sm text-gray-600">{formattedDate}</span>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase">
                  Amount
                </h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  ${payment.amount.toFixed(2)}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase">
                  Transaction ID
                </h3>
                <div className="mt-1 flex items-center">
                  <p className="text-gray-900 font-mono mr-2">
                    {payment.transactionId}
                  </p>
                  <button
                    onClick={() =>
                      copyToClipboard(payment.transactionId, payment.id)
                    }
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    aria-label="Copy transaction ID"
                  >
                    {copiedId === payment.id ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase">
                  Email
                </h3>
                <p className="mt-1 text-gray-900">{payment.email}</p>
              </div>

              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase">
                  User ID
                </h3>
                <p className="mt-1 text-gray-700 text-sm font-mono truncate">
                  {payment.userId}
                </p>
              </div>

              <div>
                {payment.status && (
                  <span className="text-sm text-green-400 font-semibold">
                    Thank you for your purchase! As a premium user, you now have
                    full access to all of my exclusive reviews and insights.
                    Enjoy the premium experience!
                  </span>
                )}
              </div>
            </div>

            <Link
              href={"/reviews"}
              className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center"
            >
              <SecondaryButton className="w-52">
                See Premium Reviews
              </SecondaryButton>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentDetails;
