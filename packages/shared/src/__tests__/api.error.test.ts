// packages/shared/src/__tests__/api.error.test.ts
/**
 * Error‑path tests for the shared API helpers.
 * Each helper should throw (or propagate) the Supabase error object when the
 * underlying call returns an `error` field.
 */
import {
  createAccount,
  getAccounts,
  createCategory,
  createTransaction,
  getTransactions,
  createBudget,
  getBudgets,
} from "@shared/src/api";
import { supabase } from "@shared/src/supabaseClient";

jest.mock("@shared/src/supabaseClient", () => {
  const mockFrom = jest.fn(() => ({
    select: jest.fn(() => mockFrom),
    insert: jest.fn(() => mockFrom),
    eq: jest.fn(() => mockFrom),
    single: jest.fn(),
  }));

  const mockAuth = {
    getUser: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(() => ({ subscription: { unsubscribe: jest.fn() } })),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  };

  const mockFunctions = { invoke: jest.fn() };

  return { supabase: { from: mockFrom, auth: mockAuth, functions: mockFunctions } };
});

describe("Shared API helpers – error handling", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createAccount propagates Supabase error", async () => {
    const err = new Error("insert failed");
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: err }),
    } as any);

    await expect(
      createAccount({
        user_id: "uid-1",
        name: "Bad",
        type: "bank",
        balance: 0,
        currency: "USD",
      })
    ).rejects.toThrow(err);
  });

  test("getAccounts propagates Supabase error", async () => {
    const err = new Error("select failed");
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      // The real implementation does `await supabase.from(...).select(...).eq(...);`
      // which resolves to an object with `data` and `error`.
      then: jest.fn(),
      // We'll simulate the resolved value directly:
      // When the helper awaits, it receives the object we return here.
      // So we mock the Promise that the chain returns.
      // Using `mockResolvedValue` on the final call chain.
      // To keep it simple, we replace the whole chain with a jest mock that resolves.
    } as any);
    // Attach a `.then` that resolves with the error payload.
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: null, error: err }),
    }));

    await expect(getAccounts("uid-1")).rejects.toThrow(err);
  });

  test("createCategory propagates Supabase error", async () => {
    const err = new Error("category insert error");
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: err }),
    } as any);

    await expect(
      createCategory({ user_id: "uid-1", name: "BadCat" })
    ).rejects.toThrow(err);
  });

  test("createTransaction propagates Supabase error", async () => {
    const err = new Error("transaction insert error");
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: err }),
    } as any);

    await expect(
      createTransaction({
        account_id: "acc-1",
        amount: 10,
        transaction_date: "2024-01-01",
        type: "expense",
      })
    ).rejects.toThrow(err);
  });

  test("getTransactions propagates Supabase error", async () => {
    const err = new Error("transactions fetch error");
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: null, error: err }),
    }));

    await expect(getTransactions("uid-1")).rejects.toThrow(err);
  });

  test("createBudget propagates Supabase error", async () => {
    const err = new Error("budget insert error");
    (supabase.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: err }),
    } as any);

    await expect(
      createBudget({
        user_id: "uid-1",
        category_id: "cat-1",
        month: "2024-09",
        limit_amount: 1000,
      })
    ).rejects.toThrow(err);
  });

  test("getBudgets propagates Supabase error", async () => {
    const err = new Error("budgets fetch error");
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      then: jest.fn().mockResolvedValue({ data: null, error: err }),
    }));

    await expect(getBudgets("uid-1")).rejects.toThrow(err);
  });
});
