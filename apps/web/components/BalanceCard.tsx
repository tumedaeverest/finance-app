// apps/web/components/BalanceCard.tsx
import React from "react";

interface BalanceCardProps {
  title: string;
  amount: number;
  currency?: string;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ title, amount, currency = "USD" }) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-2xl font-semibold text-gray-800">{formatted}</p>
    </div>
  );
};
