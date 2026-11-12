// apps/mobile/src/screens/DashboardScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useSupabaseAuth } from "../../packages/shared/src/auth";
import { Account, Transaction, getAccounts, getTransactions } from "@shared/src/api";
import BalanceCard from "../components/BalanceCard";

export default function DashboardScreen() {
  const { user, loading } = useSupabaseAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([getAccounts(user.id), getTransactions(user.id)])
      .then(([acc, tx]) => {
        setAccounts(acc);
        setTransactions(tx);
      })
      .catch((e) => setError(e.message));
  }, [user]);

  if (loading) return <ActivityIndicator style={styles.center} size="large" />;
  if (!user) return <Text style={styles.center}>Please sign in.</Text>;

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
    .slice(0, 5);

  const renderTx = ({ item }: { item: Transaction }) => (
    <View style={styles.txRow}>
      <Text style={styles.txDate}>{item.transaction_date}</Text>
      <Text style={styles.txCategory}>{item.category_id ?? "—"}</Text>
      <Text
        style={[styles.txAmount, item.type === "income" ? styles.income : styles.expense]}
      >
        {item.type === "expense" ? "-" : "+"}{item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <BalanceCard title="Total Balance" amount={totalBalance} />

      <Text style={styles.sectionHeader}>Recent Transactions</Text>
      {recentTx.length === 0 ? (
        <Text style={styles.empty}>No recent activity.</Text>
      ) : (
        <FlatList data={recentTx} keyExtractor={(i) => i.id} renderItem={renderTx} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 12 },
  error: { color: "#ef4444", marginBottom: 8 },
  sectionHeader: { marginTop: 20, fontSize: 18, fontWeight: "500" },
  empty: { marginTop: 8, color: "#555" },
  txRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },
  txDate: { flex: 1 },
  txCategory: { flex: 1, textAlign: "center" },
  txAmount: { flex: 1, textAlign: "right" },
  income: { color: "#10b981" },
  expense: { color: "#ef4444" },
});
