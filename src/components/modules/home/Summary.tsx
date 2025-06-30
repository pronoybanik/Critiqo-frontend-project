"use client";

import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Users,
  Activity,
  Star,
  TrendingUp,
  ArrowUp,
} from "lucide-react";

const Summary = () => {
  const data = {
    reviews: 12300,
    users: 5820,
    activities: 2345,
    comments: 8910,
  };

  const growthData = {
    reviews: 18,
    users: 12,
    activities: 7,
    comments: 15,
  };

  const [counters, setCounters] = useState({
    reviews: 0,
    users: 0,
    activities: 0,
    comments: 0,
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    const incrementValues = {
      reviews: data.reviews / steps,
      users: data.users / steps,
      activities: data.activities / steps,
      comments: data.comments / steps,
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;

      if (currentStep <= steps) {
        setCounters({
          reviews: Math.round(incrementValues.reviews * currentStep),
          users: Math.round(incrementValues.users * currentStep),
          activities: Math.round(incrementValues.activities * currentStep),
          comments: Math.round(incrementValues.comments * currentStep),
        });
      } else {
        setCounters(data);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const cards = [
    {
      title: "Reviews",
      value: counters.reviews,
      growth: growthData.reviews,
      icon: Star,
      color: "purple",
      bgLight: "bg-purple-50",
      bgDark: "bg-purple-400",
      border: "border-purple-300",
      hoverGlow: "hover:shadow-purple-200",
      barColor: "bg-purple-300",
      textColor: "text-purple-700",
    },
    {
      title: "Users",
      value: counters.users,
      growth: growthData.users,
      icon: Users,
      color: "blue",
      bgLight: "bg-blue-50",
      bgDark: "bg-blue-400",
      border: "border-blue-300",
      hoverGlow: "hover:shadow-blue-200",
      barColor: "bg-blue-300",
      textColor: "text-blue-700",
    },
    {
      title: "Activities",
      value: counters.activities,
      growth: growthData.activities,
      icon: Activity,
      color: "green",
      bgLight: "bg-green-50",
      bgDark: "bg-green-400",
      border: "border-green-300",
      hoverGlow: "hover:shadow-green-200",
      barColor: "bg-green-300",
      textColor: "text-green-700",
    },
    {
      title: "Comments",
      value: counters.comments,
      growth: growthData.comments,
      icon: MessageCircle,
      color: "pink",
      bgLight: "bg-pink-50",
      bgDark: "bg-pink-400",
      border: "border-pink-300",
      hoverGlow: "hover:shadow-pink-200",
      barColor: "bg-pink-300",
      textColor: "text-pink-700",
    },
  ];

  return (
    <div className="container-fluid mx-auto">
      <div className="py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 -z-10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 shadow-sm mb-4">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
              Platform Statistics
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Our Growing{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Community
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl bg-white shadow-lg border border-l-4 ${card.border} ${card.hoverGlow} hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className={`p-6 ${card.bgLight}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {card.title}
                      </p>
                      <h3 className="text-2xl md:text-3xl font-bold mt-1">
                        {card.value.toLocaleString()}
                      </h3>
                      <div className="flex items-center mt-2">
                        <ArrowUp className={`w-4 h-4 ${card.textColor}`} />
                        <span
                          className={`text-xs font-medium ml-1 ${card.textColor}`}
                        >
                          {card.growth}% this month
                        </span>
                      </div>
                    </div>
                    <div
                      className={`rounded-full p-3 ${card.bgDark} shadow-lg transform transition-all duration-300 hover:scale-110`}
                    >
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="w-full h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
                    <div
                      className={`h-full ${card.barColor} rounded-full`}
                      style={{
                        width: `${Math.min(
                          100,
                          (card.value /
                            (data[
                              card.title.toLowerCase() as keyof typeof data
                            ] *
                              1.2)) *
                            100
                        )}%`,
                        transition: "width 2s ease-in-out",
                      }}
                    ></div>
                  </div>
                </div>
                <div
                  className={`h-1 w-full absolute bottom-0 left-0 ${card.barColor}`}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
