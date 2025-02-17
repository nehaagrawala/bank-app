import isValidDate from "./utils";

export default function Interest({ setInterestRules, setScreen }) {
  const handleInterestInput = (event) => {
    if (event.key === "Enter") {
      const input = event.target.value.trim();
      if (!input) {
        setScreen("menu");
        return;
      }

      const [date, ruleId, rate] = input.split(" ");
      const parsedRate = parseFloat(rate);

      // Validate the input
      if (
        !isValidDate(date) ||
        !ruleId ||
        parsedRate <= 0 ||
        parsedRate >= 100
      ) {
        alert("Date should be in YYYYMMdd format");
        return;
      }

      // Add or update the interest rule
      setInterestRules((prev) => {
        const updatedRules = prev.filter((rule) => rule.date !== date);
        updatedRules.push({ date, ruleId, rate: parsedRate?.toFixed(2) });
        return updatedRules.sort((a, b) => (a.date > b.date ? 1 : -1));
      });

      event.target.value = "";
    }
  };

  return (
    <div>
      <p>
        Please enter interest rule details in &lt;Date&gt; &lt;RuleId&gt;
        &lt;Rate in %&gt; format
      </p>
      <p>(or enter blank to go back to main menu):</p>
      <input
        type="text"
        placeholder="YYYYMMDD RULE_ID RATE"
        className="border rounded px-2 py-1 w-full mt-2 input-menu"
        onKeyDown={handleInterestInput}
      />
    </div>
  );
}
