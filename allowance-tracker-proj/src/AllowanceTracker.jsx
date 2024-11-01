import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Minus, Plus, PiggyBank, Gift, Wallet } from 'lucide-react';
import { db } from './firebase';
import { ref, onValue, set } from 'firebase/database';

const AllowanceTracker = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [accounts, setAccounts] = useState({
    charlie: { age: 10, spend: 6, save: 2, give: 2 },
    henry: { age: 8, spend: 4.80, save: 1.60, give: 1.60 },
    baz: { age: 6, spend: 3.60, save: 1.20, give: 1.20 }
  });

  // Load initial data from Firebase
  useEffect(() => {
    const accountsRef = ref(db, 'accounts');
    onValue(accountsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setAccounts(data);
      }
    });
  }, []);

  // Save to Firebase whenever accounts change
  const saveToFirebase = (newAccounts) => {
    const accountsRef = ref(db, 'accounts');
    set(accountsRef, newAccounts);
  };

  const adjustBalance = (kid, category, amount) => {
    const newAccounts = {
      ...accounts,
      [kid]: {
        ...accounts[kid],
        [category]: Math.max(0, Number((accounts[kid][category] + amount).toFixed(2)))
      }
    };
    setAccounts(newAccounts);
    saveToFirebase(newAccounts);
  };

  const processWeeklyAllowance = () => {
    const newAccounts = { ...accounts };
    Object.entries(accounts).forEach(([kid, data]) => {
      const weeklyTotal = data.age;
      newAccounts[kid] = {
        ...data,
        spend: Number((data.spend + (weeklyTotal * 0.6)).toFixed(2)),
        save: Number((data.save + (weeklyTotal * 0.2)).toFixed(2)),
        give: Number((data.give + (weeklyTotal * 0.2)).toFixed(2))
      };
    });
    setAccounts(newAccounts);
    saveToFirebase(newAccounts);
  };

  const AccountCard = ({ name, data }) => {
    const [adjustAmount, setAdjustAmount] = useState(1);

    return (
      <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-200 border-2">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-2xl capitalize text-blue-900">{name}'s Account (Age: {data.age})</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Spend:</span> 
              <span className="text-lg">${data.spend.toFixed(2)}</span>
              {isAdmin && (
                <div className="ml-auto flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(Number(e.target.value))}
                    className="w-20"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => adjustBalance(name, 'spend', -adjustAmount)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => adjustBalance(name, 'spend', adjustAmount)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5" />
              <span className="font-medium">Save:</span> 
              <span className="text-lg">${data.save.toFixed(2)}</span>
              {isAdmin && (
                <div className="ml-auto flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => adjustBalance(name, 'save', -adjustAmount)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => adjustBalance(name, 'save', adjustAmount)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <span className="font-medium">Give:</span> 
              <span className="text-lg">${data.give.toFixed(2)}</span>
              {isAdmin && (
                <div className="ml-auto flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => adjustBalance(name, 'give', -adjustAmount)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => adjustBalance(name, 'give', adjustAmount)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Tabs defaultValue="view" className="mb-6">
        <TabsList>
          <TabsTrigger value="view" onClick={() => setIsAdmin(false)}>View Mode</TabsTrigger>
          <TabsTrigger value="admin" onClick={() => setIsAdmin(true)}>Parent Mode</TabsTrigger>
        </TabsList>
      </Tabs>

      {isAdmin && (
        <Button 
          className="mb-4 w-full"
          onClick={processWeeklyAllowance}
        >
          Process Weekly Allowance
        </Button>
      )}

      {Object.entries(accounts).map(([name, data]) => (
        <AccountCard key={name} name={name} data={data} />
      ))}
    </div>
  );
};

export default AllowanceTracker;