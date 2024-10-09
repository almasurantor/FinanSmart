import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema"; // Removed Budgets import as it's not used
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";

function AddExpense({ budgetId, refreshData }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const addNewExpense = async () => {
    setLoading(true);
    try {
      const result = await db
        .insert(Expenses)
        .values({
          name: name,
          amount: parseFloat(amount), // Convert amount to number
          budgetId: budgetId,
          createdAt: moment().format("YYYY-MM-DD"), // Use a standard date format
        })
        .returning({ insertedId: Expenses.id }); // Correct reference

      setAmount("");
      setName("");
      
      if (result) {
        refreshData();
        toast("New Expense Added!");
      } else {
        toast.error("Failed to add expense."); // Handle error
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("An error occurred while adding expense.");
    } finally {
      setLoading(false); // Ensure loading state resets
    }
  };

  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          type="number" // Specify input type as number
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount) || loading}
        onClick={addNewExpense}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}

export default AddExpense;