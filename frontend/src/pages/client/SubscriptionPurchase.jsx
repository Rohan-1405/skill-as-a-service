import React, { useState } from "react";
import PlanSelector from "../../components/subscription/PlanSelector";
import CheckoutSummary from "../../components/subscription/CheckoutSummary";
import PaymentSuccess from "../../components/subscription/PaymentSuccess";
import "../../styles/purchase.css";

// Mock freelancer + plans data (in real app this comes from API via route params)
const MOCK_FREELANCER = {
  name: "Arjun Sharma",
  title: "Full Stack Developer",
  avatar: null,
  rating: 4.9,
  reviews: 128,
  location: "Bangalore, India",
  skills: ["React JS", "Node.js", "Spring Boot"],
};

const MOCK_PLANS = [
  {
    id: 1,
    type: "basic",
    plan_name: "Basic",
    price: 2999,
    billing_cycle: "monthly",
    delivery_days: 7,
    requests: 3,
    revisions: 1,
    description: "Perfect for small tasks and getting started with my services.",
    features: ["3 service requests/month", "7 day delivery SLA", "1 revision per request", "Email support"],
  },
  {
    id: 2,
    type: "standard",
    plan_name: "Standard",
    price: 5999,
    billing_cycle: "monthly",
    delivery_days: 5,
    requests: 8,
    revisions: 3,
    description: "Best for ongoing development work with faster turnarounds.",
    features: ["8 service requests/month", "5 day delivery SLA", "3 revisions per request", "Priority support", "Weekly status calls"],
  },
  {
    id: 3,
    type: "premium",
    plan_name: "Premium",
    price: 11999,
    billing_cycle: "monthly",
    delivery_days: 2,
    requests: 20,
    revisions: 5,
    description: "Dedicated capacity for teams that need fast, high-volume work.",
    features: ["20 service requests/month", "2 day delivery SLA", "Unlimited revisions", "Dedicated Slack channel", "Daily standups", "Source code included"],
  },
];

const STEPS = ["Select Plan", "Checkout", "Success"];

export default function SubscriptionPurchase() {
  const [step, setStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setStep(1);
  };

  const handlePurchase = () => {
    setStep(2);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <div className="purch-page">
      {/* Stepper */}
      <div className="purch-stepper">
        {STEPS.map((label, i) => (
          <React.Fragment key={i}>
            <div className={`purch-step ${i === step ? "purch-step-active" : ""} ${i < step ? "purch-step-done" : ""}`}>
              <div className="purch-step-dot">
                {i < step ? (
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className="purch-step-label">{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`purch-step-line ${i < step ? "purch-step-line-done" : ""}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      {step === 0 && (
        <PlanSelector
          freelancer={MOCK_FREELANCER}
          plans={MOCK_PLANS}
          currentPlan={selectedPlan}
          onSelect={handleSelectPlan}
        />
      )}

      {step === 1 && selectedPlan && (
        <CheckoutSummary
          freelancer={MOCK_FREELANCER}
          plan={selectedPlan}
          onConfirm={handlePurchase}
          onBack={handleBack}
        />
      )}

      {step === 2 && selectedPlan && (
        <PaymentSuccess freelancer={MOCK_FREELANCER} plan={selectedPlan} />
      )}
    </div>
  );
}
