import { useState } from "react";
import Transaction from "./Transaction";
import Interest from "./Interest";
import PrintStatement from "./PrintStatement";
import './App.css';

export default function App() {

  const defaultTransactions = {
    'AC001': [{
      date: "20230505",
      id: "20230505-01",
      type: "D",
      amount: 100.0
    },
    {
      date: "20230601",
      id: "20230601-01",
      type: "D",
      amount: 150.0
    },
    {
      date: "20230626",
      id: "20230626-01",
      type: "W",
      amount: 20.0
    },
    {
      date: "20230626",
      id: "20230626-02",
      type: "W",
      amount: 100.0
    },
  ]};

  const defaultInterestRules = [
    {
      date: "20230101",
      ruleId: "RULE01",
      rate: "1.95",
    },
    {
      date: "20230520",
      ruleId: "RULE02",
      rate: "1.90",
    },
    {
      date: "20230615",
      ruleId: "RULE03",
      rate: "2.20",
    }
  ];

  const [screen, setScreen] = useState("menu");
  const [transactions, setTransactions] = useState(defaultTransactions);
  const [interestRules, setInterestRules] = useState(defaultInterestRules);

  const handleUserInput = (event) => {
    const input = event.target.value.trim().toUpperCase();
    if (input === "T") setScreen("transactions");
    else if (input === "I") setScreen("interest");
    else if (input === "P") setScreen("statement");
    else if (input === "Q" || input === "q") {
      setScreen("quit");
    }
    event.target.value = ""; // Clear input field after selection
  };

  const printQuitMessage = () => {
    return (
      <div className="p-4">
        <h2>Thank you for banking with AwesomeGIC Bank.</h2>
        <p>Have a nice day!</p>
      </div>
    );
  };

  const printStatement = (account) => {
    const accountTransactions = transactions[account] || [];
    return (
      <div className="p-4">
        <h2>Account: {account}</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Txn Id</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {accountTransactions.map((txn) => (
              <tr key={txn.id}>
                <td>{txn.date}</td>
                <td>{txn.id}</td>
                <td>{txn.type}</td>
                <td>{txn.amount?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4">
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

  const printInterestRules = () => {
    return (
      <div className="p-4">
        <h2>Interest Rules:</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>RuleId</th>
              <th>Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {interestRules.map((rule) => (
              <tr key={rule.date}>
                <td>{rule.date}</td>
                <td>{rule.ruleId}</td>
                <td>{rule.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4">
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
    <div className="p-4 max-w-xl mx-auto">
      {screen === "menu" && (
        <div className="border rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold">Welcome to AwesomeGIC Bank!</h2>
          <p>What would you like to do?</p>
          <p>[T] Input transactions</p>
          <p>[I] Define interest rules</p>
          <p>[P] Print statement</p>
          <p>[Q] Quit</p>
          <input
            type="text"
            placeholder="Enter your choice"
            className="border rounded px-2 py-1 w-md mt-2 input-menu"
            onKeyDown={(e) => e.key === "Enter" && handleUserInput(e)}
          />
        </div>
      )}
      {screen === "transactions" && (
        <>
          <Transaction
            setTransactions={setTransactions}
            setScreen={setScreen}
          />
          <div>{printStatement('AC001')}</div>
        </>
      )}
      {screen === "interest" && (
        <>
          <Interest setInterestRules={setInterestRules} setScreen={setScreen} />
          <div>{interestRules?.length > 0 && printInterestRules()}</div>
        </>
      )}
      {screen === "statement" && (
        <PrintStatement
          setScreen={setScreen}
          transactions={transactions}
          interestRules={interestRules}
        />
      )}
      {screen === "quit" && printQuitMessage()}
    </div>
  );
}
