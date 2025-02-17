import isValidDate from "./utils";

export default function Transaction({ setTransactions, setScreen }) {
  const handleTransactionInput = (event) => {
    if (event.key === "Enter") {
      const input = event.target.value.trim();
      if (!input) {
        setScreen("menu");
        return;
      }

      const [date, account, type, amount] = input.split(" ");
      const parsedAmount = parseFloat(amount);
      if (
        !isValidDate(date) ||
        !["D", "W"].includes(type.toUpperCase()) ||
        isNaN(parsedAmount) ||
        parsedAmount <= 0
      ) {
        alert("Date should be in YYYYMMdd format");
        return;
      }

      setTransactions((prev) => {
        const accountTransactions = prev[account] || [];

        if (type.toUpperCase() === "W") {
          const balance = accountTransactions.reduce(
            (sum, txn) => sum + (txn.type === "D" ? txn.amount : -txn.amount),
            0
          );
          if (balance < parsedAmount) {
            alert("An account's balance should not be less than 0. Therefore, the first transaction on an account should not be a withdrawal, and any transactions thereafter should not make balance go below 0");
            return prev;
          }
        }

        const newTxn = {
          date,
          id: `${date}-${(accountTransactions.length + 1)
            .toString()
            .padStart(2, "0")}`,
          type: type.toUpperCase(),
          amount: parsedAmount,
        };
        console.log({ ...prev, [account]: [...accountTransactions, newTxn] })
        return { ...prev, [account]: [...accountTransactions, newTxn] };
      });
      event.target.value = "";
    }
  };

  return (
    <div>
      <p>
        Please enter transaction details in &lt;Date&gt; &lt;Account&gt;
        &lt;Type&gt; &lt;Amount&gt; format
      </p>
      <p>(or enter blank to go back to main menu):</p>
      <input
        type="text"
        placeholder="YYYYMMDD ACCT TYPE AMOUNT"
        className="border rounded px-2 py-1 w-full mt-2 input-menu"
        onKeyDown={handleTransactionInput}
      />
    </div>
  );
}
