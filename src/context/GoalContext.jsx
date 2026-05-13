import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

const GoalContext = createContext(null);

const STORAGE_KEY = 'lokalise-demo-state-v1';

const DEFAULT_STATE = {
  goals: [
    { id: 1, name: 'New Laptop', target: 1500, current: 450 },
    { id: 2, name: 'Vacation Fund', target: 3000, current: 1200 },
  ],
  transactions: [
    {
      id: 101,
      goalId: 1,
      amount: 200,
      date: '2026-04-01',
      note: 'Paycheck deposit',
    },
    {
      id: 102,
      goalId: 1,
      amount: 250,
      date: '2026-05-01',
      note: 'Paycheck deposit',
    },
    { id: 103, goalId: 2, amount: 500, date: '2026-04-15', note: 'Side gig' },
    { id: 104, goalId: 2, amount: 700, date: '2026-05-10', note: 'Side gig' },
  ],
};

function loadInitial() {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      goals: Array.isArray(parsed.goals) ? parsed.goals : [],
      transactions: Array.isArray(parsed.transactions)
        ? parsed.transactions
        : [],
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function GoalProvider({ children }) {
  const initial = loadInitial();
  const [goals, setGoals] = useState(initial.goals);
  const [transactions, setTransactions] = useState(initial.transactions);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ goals, transactions })
      );
    } catch {
      // ignore quota / privacy errors
    }
  }, [goals, transactions]);

  const addGoal = useCallback((goal) => {
    setGoals((prev) => [...prev, { ...goal, id: Date.now() }]);
  }, []);

  const updateGoal = useCallback((updated) => {
    setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  }, []);

  const deleteGoal = useCallback((id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setTransactions((prev) => prev.filter((t) => t.goalId !== id));
  }, []);

  const addTransaction = useCallback((tx) => {
    setTransactions((prev) => [...prev, { ...tx, id: Date.now() }]);
    setGoals((prev) =>
      prev.map((g) =>
        g.id === tx.goalId ? { ...g, current: g.current + tx.amount } : g
      )
    );
  }, []);

  const getGoalTransactions = useCallback(
    (goalId) => transactions.filter((t) => t.goalId === goalId),
    [transactions]
  );

  return (
    <GoalContext.Provider
      value={{
        goals,
        transactions,
        addGoal,
        updateGoal,
        deleteGoal,
        addTransaction,
        getGoalTransactions,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}

export function useGoals() {
  const ctx = useContext(GoalContext);
  if (!ctx) throw new Error('useGoals must be used within GoalProvider');
  return ctx;
}
