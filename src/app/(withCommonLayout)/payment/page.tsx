/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Check, X, Loader2, Shield, Zap, Clock } from "lucide-react";
// import { loadStripe } from '@stripe/stripe-js';
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createPayment } from "@/services/Payment";

// Initialize Stripe - replace with your publishable key
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  interval: "month" | "year";
  features: string[];
  notIncluded: string[];
  priceId: string;
  popular: boolean;
};

type Plans = {
  monthly: Plan[];
  yearly: Plan[];
};
// Subscription plans
const plans: Plans = {
  monthly: [
    {
      id: "basic-monthly",
      name: "Basic",
      description: "Perfect for casual reviewers",
      price: 9.99,
      interval: "month",
      features: [
        "Post up to 10 reviews per month",
        "Access to basic categories",
        "No ads",
        "Community participation",
      ],
      notIncluded: [
        "Premium product access",
        "Featured reviews",
        "Analytics dashboard",
        "Early access to new features",
      ],
      priceId: "price_basic_monthly",
      popular: false,
    },
    {
      id: "pro-monthly",
      name: "Pro",
      description: "For serious product reviewers",
      price: 19.99,
      interval: "month",
      features: [
        "Unlimited reviews",
        "Access to all categories",
        "Featured reviews section",
        "Analytics dashboard",
        "No ads",
        "Community participation",
        "Priority support",
      ],
      notIncluded: ["Early access to new features", "Custom profile branding"],
      priceId: "price_pro_monthly",
      popular: true,
    },
    {
      id: "premium-monthly",
      name: "Premium",
      description: "For professional reviewers",
      price: 39.99,
      interval: "month",
      features: [
        "Everything in Pro",
        "Early access to new features",
        "Custom profile branding",
        "API access",
        "Verified reviewer badge",
        "Direct brand connections",
      ],
      notIncluded: [],
      priceId: "price_premium_monthly",
      popular: false,
    },
  ],
  yearly: [
    {
      id: "basic-yearly",
      name: "Basic",
      description: "Perfect for casual reviewers",
      price: 99.99,
      originalPrice: 119.88, // 9.99 * 12
      interval: "year",
      features: [
        "Post up to 10 reviews per month",
        "Access to basic categories",
        "No ads",
        "Community participation",
      ],
      notIncluded: [
        "Premium product access",
        "Featured reviews",
        "Analytics dashboard",
        "Early access to new features",
      ],
      priceId: "price_basic_yearly",
      popular: false,
    },
    {
      id: "pro-yearly",
      name: "Pro",
      description: "For serious product reviewers",
      price: 199.99,
      originalPrice: 239.88, // 19.99 * 12
      interval: "year",
      features: [
        "Unlimited reviews",
        "Access to all categories",
        "Featured reviews section",
        "Analytics dashboard",
        "No ads",
        "Community participation",
        "Priority support",
      ],
      notIncluded: ["Early access to new features", "Custom profile branding"],
      priceId: "price_pro_yearly",
      popular: true,
    },
    {
      id: "premium-yearly",
      name: "Premium",
      description: "For professional reviewers",
      price: 399.99,
      originalPrice: 479.88, // 39.99 * 12
      interval: "year",
      features: [
        "Everything in Pro",
        "Early access to new features",
        "Custom profile branding",
        "API access",
        "Verified reviewer badge",
        "Direct brand connections",
      ],
      notIncluded: [],
      priceId: "price_premium_yearly",
      popular: false,
    },
  ],
};

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useUser();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const handleSubscription = async (price: number) => {
    if (!user) {
      toast.error("Please log in to subscribe");
      router.push("/login");
      return;
    }

    const data = {
      name: user.email,
      amount: Number(price),
      address: "Dhaka, Bangladesh",
      city: "Dhaka",
      contact: "01325478952",
    };

    try {
      setIsLoading((prev) => ({ ...prev, [price]: true }));

      const response = await createPayment(data);


      // Handle based on ShurjoPay's expected response format
      // if (response?.success) {
      //   toast.success("Payment Succesfully Done");
      // }
      // if (!response || response?.data?.checkout_url) {
      //   throw new Error(response?.message || 'Failed to create ShurjoPay session');
      // } else {
      // }

      //  Redirect user to ShurjoPay checkout page
      window.location.href = response?.data?.checkout_url;
      console.error(response?.data?.checkout_url);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || "Failed to process subscription. Please try again."
        );
      } else {
        toast.error("An unknown error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Unlock the full potential of our product review portal with a
          subscription plan that fits your needs.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <Tabs
          defaultValue="monthly"
          value={billingInterval}
          onValueChange={(val: string) =>
            setBillingInterval(val as "monthly" | "yearly")
          }
          className="w-full max-w-md"
        >
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">
              Yearly
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                Save 16%
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        {plans[billingInterval].map((plan) => (
          <Card
            key={plan.id}
            className={`flex flex-col ${
              plan.popular
                ? "border-blue-500 ring-1 ring-blue-500 shadow-lg"
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">
                MOST POPULAR
              </div>
            )}
            <CardHeader className={plan.popular ? "pt-4" : ""}>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="mt-1.5">
                {plan.description}
              </CardDescription>
              <div className="mt-4 flex items-baseline text-gray-900">
                <span className="text-4xl font-bold tracking-tight">
                  ${plan.price}
                </span>
                <span className="ml-1 text-lg font-medium text-gray-500">
                  /{plan.interval}
                </span>
              </div>
              {plan.originalPrice && (
                <div className="mt-1 text-sm text-gray-500">
                  <span className="line-through">${plan.originalPrice}</span>
                  <span className="ml-2 text-green-600">
                    Save ${(plan.originalPrice - plan.price).toFixed(2)}
                  </span>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Whats included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature: any) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {plan.notIncluded.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Not included:
                    </h4>
                    <ul className="space-y-2">
                      {plan.notIncluded.map((feature: any) => (
                        <li key={feature} className="flex items-start">
                          <X className="h-5 w-5 text-gray-400 flex-shrink-0 mr-2" />
                          <span className="text-sm text-gray-500">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                className={`w-full ${
                  plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""
                }`}
                onClick={() => handleSubscription(plan.price)}
                disabled={isLoading[plan.id]}
              >
                {isLoading[plan.id] ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing
                  </>
                ) : (
                  <>Subscribe to {plan.name}</>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {/* Payment rules ================ */}
      <div className="mt-16 bg-gray-50 rounded-xl border border-gray-200 p-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Secure Payments</h3>
              <p className="mt-2 text-gray-600">
                All transactions are secured with Stripes industry-leading
                encryption.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Cancel Anytime</h3>
              <p className="mt-2 text-gray-600">
                Flexible subscriptions that can be canceled online at any time.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Instant Access</h3>
              <p className="mt-2 text-gray-600">
                Get immediate access to all features after your payment is
                processed.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* faq section ================================= */}
      <div className="mt-12 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group border-b pb-4">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span>How does billing work?</span>
              <span className="transition group-open:rotate-180">
                <svg
                  fill="none"
                  height="24"
                  width="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3">
              We use Stripe for secure payment processing. Youll be charged at
              the beginning of each billing period (monthly or yearly). You can
              cancel anytime from your account dashboard.
            </p>
          </details>
          <details className="group border-b pb-4">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span>Can I change plans later?</span>
              <span className="transition group-open:rotate-180">
                <svg
                  fill="none"
                  height="24"
                  width="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3">
              Yes! You can upgrade or downgrade your plan at any time. When
              upgrading, youll be charged the prorated difference. When
              downgrading, the new rate will apply at the start of your next
              billing cycle.
            </p>
          </details>
          <details className="group border-b pb-4">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span>What payment methods do you accept?</span>
              <span className="transition group-open:rotate-180">
                <svg
                  fill="none"
                  height="24"
                  width="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3">
              We accept all major credit cards (Visa, Mastercard, American
              Express) and some debit cards. In select countries, we also
              support local payment methods through Stripe.
            </p>
          </details>
          <details className="group border-b pb-4">
            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
              <span>Is there a free trial?</span>
              <span className="transition group-open:rotate-180">
                <svg
                  fill="none"
                  height="24"
                  width="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </summary>
            <p className="text-gray-600 mt-3">
              We offer limited free access to our basic features. To fully
              experience the platform, we recommend subscribing to one of our
              plans, which you can cancel within the first 14 days for a full
              refund if youre not satisfied.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}
