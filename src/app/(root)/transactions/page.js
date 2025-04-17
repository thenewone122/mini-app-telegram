import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowLeft, ArrowUp, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function TransactionsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-foreground">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back</span>
            </Link>
            <h1 className="text-lg font-bold">Transactions</h1>
            <div className="w-5"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <section className="container py-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-center">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold">$1,250.00</div>
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10">
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
                <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary/10">
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Transactions List */}
      <section className="container flex-1 pb-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="deposits"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Deposits
            </TabsTrigger>
            <TabsTrigger
              value="withdrawals"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Withdrawals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            <div className="space-y-3">
              {[
                { id: 1, type: "win", amount: 200, date: "Today, 14:32", description: "Won game against Magnus" },
                { id: 2, type: "deposit", amount: 500, date: "Yesterday, 10:15", description: "Deposit via Telegram" },
                {
                  id: 3,
                  type: "loss",
                  amount: -150,
                  date: "Yesterday, 08:45",
                  description: "Lost game against Hikaru",
                },
                { id: 4, type: "win", amount: 300, date: "Apr 10, 2023", description: "Won game against Fabiano" },
                {
                  id: 5,
                  type: "withdrawal",
                  amount: -400,
                  date: "Apr 8, 2023",
                  description: "Withdrawal to bank account",
                },
              ].map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden bg-card border-border">
                  <div className="flex items-center p-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                        transaction.type === "deposit"
                          ? "bg-primary/20"
                          : transaction.type === "withdrawal"
                            ? "bg-destructive/20"
                            : transaction.type === "win"
                              ? "bg-primary/20"
                              : "bg-destructive/20"
                      }`}
                    >
                      {transaction.type === "deposit" && <ArrowDown className={`w-5 h-5 text-primary`} />}
                      {transaction.type === "withdrawal" && <ArrowUp className={`w-5 h-5 text-destructive`} />}
                      {transaction.type === "win" && <ArrowDown className={`w-5 h-5 text-primary`} />}
                      {transaction.type === "loss" && <ArrowUp className={`w-5 h-5 text-destructive`} />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                    </div>
                    <div className="flex items-center">
                      <span className={`font-medium ${transaction.amount > 0 ? "text-primary" : "text-destructive"}`}>
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount}.00
                      </span>
                      <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="deposits" className="space-y-4 mt-4">
            <div className="space-y-3">
              {[
                { id: 2, type: "deposit", amount: 500, date: "Yesterday, 10:15", description: "Deposit via Telegram" },
                { id: 6, type: "deposit", amount: 200, date: "Apr 5, 2023", description: "Deposit via Telegram" },
                { id: 7, type: "deposit", amount: 300, date: "Apr 1, 2023", description: "Deposit via Telegram" },
              ].map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden bg-card border-border">
                  <div className="flex items-center p-4">
                    <div className="w-10  h-10 rounded-full flex items-center justify-center mr-4 bg-primary/20">
                      <ArrowDown className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-primary">+{transaction.amount}.00</span>
                      <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-4 mt-4">
            <div className="space-y-3">
              {[
                {
                  id: 5,
                  type: "withdrawal",
                  amount: -400,
                  date: "Apr 8, 2023",
                  description: "Withdrawal to bank account",
                },
                {
                  id: 8,
                  type: "withdrawal",
                  amount: -200,
                  date: "Mar 25, 2023",
                  description: "Withdrawal to bank account",
                },
              ].map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden bg-card border-border">
                  <div className="flex items-center p-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 bg-destructive/20">
                      <ArrowUp className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">{transaction.date}</div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-destructive">{transaction.amount}.00</span>
                      <ChevronRight className="w-4 h-4 ml-2 text-muted-foreground" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
