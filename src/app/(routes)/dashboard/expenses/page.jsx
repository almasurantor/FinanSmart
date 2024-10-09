"use client";
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]);

  /**
   * Used to get all expenses belonging to the user
   */
  const getAllExpenses = async () => {
    try {
      setLoading(true); // Set loading to true when starting fetch
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
        .orderBy(desc(Expenses.id));

      setExpensesList(result);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      // Optionally handle the error with a toast or alert
    } finally {
      setLoading(false); // Ensure loading is set to false after fetching
    }
  };

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>My Expenses</h2>
      {loading ? (
        <p>Loading expenses...</p> // Loading message
      ) : (
        <ExpenseListTable
          refreshData={getAllExpenses}
          expensesList={expensesList}
        />
      )}
    </div>
  );
}

export default ExpensesScreen;