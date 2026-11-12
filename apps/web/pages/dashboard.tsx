// apps/web/pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useSupabaseAuth } from "../../packages/shared/src/auth";
import { Account, Transaction, getAccounts, getTransactions } from "@shared/src/api";
import { BalanceCard } from "../components/BalanceCard";

export default function Dashboard() {
  const { user, loading } = useSupabaseAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    // Load accounts & transactions in parallel
    Promise.all([getAccounts(user.id), getTransactions(user.id)])
      .then(([accs, txs]) => {
        setAccounts(accs);
        setTransactions(txs);
      })
      .catch((e) => setError(e.message));
  }, [user]);

  if (loading) return <p className="p-4">Loading…</p>;
  if (!user) return <p className="p-4">Please sign in to view your dashboard.</p>;

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  // Show the 5 most recent transactions
  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
    .slice(0, 5);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>

      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BalanceCard title="Total Balance" amount={totalBalance} />
      </div>

      <section className="mt-8">
        <h2 className="mb-2 text-xl font-semibold">Recent Transactions</h2>
        {recentTx.length === 0 ? (
          <p className="text-gray-500">No recent activity.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.map((tx) => (
                <tr key={tx.id} className="border-b">
                  <td className="p-2">{tx.transaction_date}</td>
                  <td className="p-2">{tx.category_id || "—"}</td>
                  <td className={"p-2 text-right " + (tx.type === "income" ? "text-green-600" : "text-red-600")}>
                    {tx.type === "expense" ? "-" : "+"}{tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
