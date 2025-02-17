import { use, useState, useEffect } from "react";

export default function PrintStatement({ setScreen, transactions, interestRules }) {
  
  const [statements, setStatements] = useState([]);

  useEffect(() => {
    generateStatement("AC001", "202306");
  });
  
  const calculateInterest = (balance, rate, numOfDays) => {
    return (balance * rate * numOfDays) / 365;
  };

  const generateStatement = (account, month) => {
    const filteredTransactions = transactions[account]?.filter((txn) =>
      txn.date.startsWith(month)
    );
    if (!filteredTransactions) {
      alert("No transactions found for this account and month.");
      return;
    }

    let balance = 0;
    const interestPeriods = [];
    const interestTransactions = [];

    // Calculate balance and interest for each period
    let currentPeriodStart = null;
    let currentPeriodEnd = null;
    let currentBalance = 0;

    filteredTransactions.forEach((txn, index) => {
      if (txn.type === "D") {
        balance += txn.amount;
      } else if (txn.type === "W") {
        balance -= txn.amount;
      }

      // Check if the period should be updated (based on changes in the interest rate)
      const currentDate = txn.date;

      // Determine which rule applies (based on transaction date)
      let applicableRule = null;
      for (const rule of interestRules) {
        if (rule.date <= currentDate) {
          applicableRule = rule;
        }
      }

      // If there's a new period (for interest calculation), apply interest
      if (!currentPeriodStart) {
        currentPeriodStart = currentDate;
      }

      if (applicableRule) {
        currentBalance = balance;
        currentPeriodEnd = currentDate;
        interestPeriods.push({
          startDate: currentPeriodStart,
          endDate: currentPeriodEnd,
          balance: currentBalance,
          ruleId: applicableRule.ruleId,
          rate: applicableRule.rate,
          numOfDays:
            parseInt(currentPeriodEnd.slice(6, 8), 10) -
            parseInt(currentPeriodStart.slice(6, 8), 10),
        });
        currentPeriodStart = currentDate;
      }
    });

    // Calculate the total interest
    let totalInterest = 0;
    interestPeriods.forEach((period) => {
      totalInterest += calculateInterest(
        period.balance,
        period.rate / 100,
        period.numOfDays
      );
    });

    totalInterest = totalInterest?.toFixed(2);

    // Add the interest as the final transaction
    interestTransactions.push({
      date: `${month}30`,
      id: "",
      type: "I",
      amount: totalInterest,
      balance: (balance + parseFloat(totalInterest))?.toFixed(2),
    });

    // Display the statement
    setStatements({
      account,
      transactions: filteredTransactions,
      interestTransactions,
    });

    setScreen("statement");
  };

  const handleUserInput = (event) => {
    const input = event.target.value.trim().toUpperCase();
    if (input === "T") setScreen("transactions");
    else if (input === "I") setScreen("interest");
    else if (input === "P") setScreen("statement");
    else if (input === "Q") setScreen("quit");
    event.target.value = ""; // Clear input field after selection
  };

  const handleStatementInput = (event) => {
    if (event.key === "Enter") {
      const input = event.target.value.trim();
      if (!input) {
        setScreen("menu");
        return;
      }

      const [account, month] = input.split(" ");
      if (!account || !month || !/^\d{6}$/.test(month)) {
        alert("Invalid account or month format.");
        return;
      }

      generateStatement(account, month);
      event.target.value = "";
    }
  };

  const printStatement = () => {
    return (
      <div className="p-4">
        <div>
          <p>
            Please enter account and month to generate the statement Account
            Year Month
          </p>
          <input
            type="text"
            placeholder="Enter account and month"
            className="border rounded px-2 py-1 w-full mt-2 input-menu"
            onKeyDown={(e) => e.key === "Enter" && handleStatementInput(e)} // Triggers on pressing Enter
          />
        </div>

        <h2 className="p-4">Account: {statements.account}</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Txn Id</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {statements.transactions?.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.date}</td>
                <td>{txn.id}</td>
                <td>{txn.type}</td>
                <td>{txn.amount?.toFixed(2)}</td>
                <td>{txn.balance?.toFixed(2)}</td>
              </tr>
            ))}
            {statements.interestTransactions?.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.date}</td>
                <td>{txn.id || ""}</td>
                <td>{txn.type}</td>
                <td>{txn.amount}</td>
                <td>{txn.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <p>Is there anything else you'd like to do?</p>
          <p>[T] Input transactions</p>
          <p>[I] Define interest rules</p>
          <p>[P] Print statement</p>
          <p>[Q] Quit</p>
          <input
            type="text"
            placeholder="Enter your choice"
            className="border rounded px-2 py-1 w-full mt-2"
            onKeyDown={(e) => e.key === "Enter" && handleUserInput(e)}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
        {printStatement()}
    </div>
  );
}
