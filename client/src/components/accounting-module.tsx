import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calculator, 
  Plus, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  PieChart,
  BarChart3,
  CreditCard,
  Wallet,
  Receipt,
  Building,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: "Income" | "Expense";
  amount: number;
  account: string;
  reference: string;
  notes: string;
  tags: string[];
}

interface Account {
  id: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";
  balance: number;
  description: string;
}

interface Budget {
  id: string;
  category: string;
  budgetedAmount: number;
  actualAmount: number;
  period: "Monthly" | "Quarterly" | "Yearly";
  year: number;
  month?: number;
}

export default function AccountingModule() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddTransactionDialog, setShowAddTransactionDialog] = useState(false);
  const [showAddAccountDialog, setShowAddAccountDialog] = useState(false);

  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: format(new Date(), "yyyy-MM-dd"),
    description: "",
    category: "",
    type: "Expense",
    amount: 0,
    account: "",
    reference: "",
    notes: "",
    tags: []
  });

  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    name: "",
    type: "Asset",
    balance: 0,
    description: ""
  });

  // Sample data initialization
  useEffect(() => {
    const sampleTransactions: Transaction[] = [
      {
        id: "1",
        date: "2024-07-10",
        description: "Seed Purchase - Corn",
        category: "Seeds & Plants",
        type: "Expense",
        amount: 1200,
        account: "Operating Expenses",
        reference: "INV-2024-001",
        notes: "Pioneer corn seed for Field A",
        tags: ["crops", "seeds"]
      },
      {
        id: "2",
        date: "2024-07-08",
        description: "Milk Sales - Weekly",
        category: "Livestock Sales",
        type: "Income",
        amount: 3500,
        account: "Revenue",
        reference: "SALE-2024-028",
        notes: "Weekly milk delivery to dairy co-op",
        tags: ["livestock", "milk", "sales"]
      },
      {
        id: "3",
        date: "2024-07-05",
        description: "Fertilizer Application",
        category: "Field Supplies",
        type: "Expense",
        amount: 850,
        account: "Operating Expenses",
        reference: "INV-2024-002",
        notes: "NPK fertilizer for wheat fields",
        tags: ["fertilizer", "crops"]
      },
      {
        id: "4",
        date: "2024-07-03",
        description: "Equipment Maintenance",
        category: "Equipment",
        type: "Expense",
        amount: 450,
        account: "Maintenance & Repairs",
        reference: "SVC-2024-015",
        notes: "Tractor hydraulic system repair",
        tags: ["equipment", "maintenance"]
      },
      {
        id: "5",
        date: "2024-07-01",
        description: "Vegetable Sales - Farmers Market",
        category: "Crop Sales",
        type: "Income",
        amount: 275,
        account: "Revenue",
        reference: "SALE-2024-027",
        notes: "Weekend farmers market sales",
        tags: ["vegetables", "market", "sales"]
      }
    ];

    const sampleAccounts: Account[] = [
      {
        id: "1",
        name: "Operating Expenses",
        type: "Expense",
        balance: 15750,
        description: "Day-to-day operational costs"
      },
      {
        id: "2",
        name: "Revenue",
        type: "Revenue",
        balance: 45200,
        description: "Income from farm operations"
      },
      {
        id: "3",
        name: "Equipment Assets",
        type: "Asset",
        balance: 125000,
        description: "Farm machinery and equipment"
      },
      {
        id: "4",
        name: "Maintenance & Repairs",
        type: "Expense",
        balance: 3200,
        description: "Equipment and facility maintenance"
      },
      {
        id: "5",
        name: "Cash",
        type: "Asset",
        balance: 28500,
        description: "Operating cash account"
      }
    ];

    const sampleBudgets: Budget[] = [
      {
        id: "1",
        category: "Seeds & Plants",
        budgetedAmount: 5000,
        actualAmount: 3200,
        period: "Yearly",
        year: 2024
      },
      {
        id: "2",
        category: "Fertilizer",
        budgetedAmount: 8000,
        actualAmount: 6500,
        period: "Yearly",
        year: 2024
      },
      {
        id: "3",
        category: "Equipment Maintenance",
        budgetedAmount: 1200,
        actualAmount: 950,
        period: "Monthly",
        year: 2024,
        month: 7
      },
      {
        id: "4",
        category: "Feed",
        budgetedAmount: 3000,
        actualAmount: 2800,
        period: "Monthly",
        year: 2024,
        month: 7
      }
    ];

    setTransactions(sampleTransactions);
    setAccounts(sampleAccounts);
    setBudgets(sampleBudgets);
  }, []);

  const getBudgetVariance = (budget: Budget) => {
    return budget.actualAmount - budget.budgetedAmount;
  };

  const getBudgetPercentage = (budget: Budget) => {
    return (budget.actualAmount / budget.budgetedAmount) * 100;
  };

  const totalIncome = transactions
    .filter(t => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  const totalAssets = accounts
    .filter(a => a.type === "Asset")
    .reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Accounting</h2>
          <p className="text-gray-600">Financial management and reporting</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowAddTransactionDialog(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
          <Button onClick={() => setShowAddAccountDialog(true)} variant="outline">
            <Building className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">${totalIncome.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${netProfit.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold text-gray-900">${totalAssets.toLocaleString()}</p>
              </div>
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
          <TabsTrigger value="budgets">Budgeting</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${transaction.type === 'Income' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">{transaction.account}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                Budget Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.slice(0, 4).map((budget) => (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{budget.category}</span>
                      <div className="text-right">
                        <span className="text-sm text-gray-600">
                          ${budget.actualAmount.toLocaleString()} / ${budget.budgetedAmount.toLocaleString()}
                        </span>
                        <Badge className={`ml-2 ${getBudgetVariance(budget) >= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {getBudgetVariance(budget) >= 0 ? 'Over' : 'Under'} ${Math.abs(getBudgetVariance(budget))}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getBudgetPercentage(budget) <= 100 ? 'bg-green-600' : 'bg-red-600'}`}
                        style={{ width: `${Math.min(getBudgetPercentage(budget), 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${transaction.type === 'Income' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <h4 className="font-semibold">{transaction.description}</h4>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>Category: {transaction.category}</span>
                          <span>Account: {transaction.account}</span>
                          <span>Date: {transaction.date}</span>
                        </div>
                        {transaction.reference && (
                          <p className="text-xs text-blue-600">Ref: {transaction.reference}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'Income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </p>
                      <Badge variant="outline">{transaction.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{account.name}</CardTitle>
                  <Badge variant="outline">{account.type}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Balance:</span>
                      <span className="font-bold text-lg">${account.balance.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600">{account.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgets.map((budget) => (
                  <div key={budget.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-lg">{budget.category}</h4>
                      <Badge variant="outline">{budget.period} {budget.year}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Budgeted</p>
                        <p className="font-bold text-lg">${budget.budgetedAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Actual</p>
                        <p className="font-bold text-lg">${budget.actualAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Variance</p>
                        <p className={`font-bold text-lg ${getBudgetVariance(budget) >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {getBudgetVariance(budget) >= 0 ? '+' : ''}${getBudgetVariance(budget).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{getBudgetPercentage(budget).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${getBudgetPercentage(budget) <= 100 ? 'bg-green-600' : 'bg-red-600'}`}
                          style={{ width: `${Math.min(getBudgetPercentage(budget), 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">P&L Statement</h3>
                <p className="text-gray-600 text-sm">Profit and Loss report for the current period</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Cash Flow</h3>
                <p className="text-gray-600 text-sm">Track money in and out of your farm</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Building className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Balance Sheet</h3>
                <p className="text-gray-600 text-sm">Assets, liabilities, and equity overview</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <PieChart className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Budget Report</h3>
                <p className="text-gray-600 text-sm">Budget vs actual performance analysis</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Calculator className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Tax Report</h3>
                <p className="text-gray-600 text-sm">Tax-ready financial summaries</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Expense Report</h3>
                <p className="text-gray-600 text-sm">Detailed breakdown of all expenses</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Transaction Dialog */}
      <Dialog open={showAddTransactionDialog} onOpenChange={setShowAddTransactionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Transaction</DialogTitle>
            <DialogDescription>
              Record a new financial transaction for your farm.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={newTransaction.type} onValueChange={(value) => setNewTransaction({...newTransaction, type: value as any})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                placeholder="e.g., Seed Purchase - Corn"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newTransaction.category}
                  onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  placeholder="e.g., Seeds & Plants"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddTransactionDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Add Transaction
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}