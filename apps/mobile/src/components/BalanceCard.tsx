// apps/mobile/src/components/BalanceCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>{formatted}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  title: { fontSize: 14, color: "#555" },
  amount: { marginTop: 4, fontSize: 20, fontWeight: "600", color: "#111" },
});
