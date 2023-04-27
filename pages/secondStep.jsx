import { useState } from 'react';

export default function MortgageCalculator() {
  const [propertyValue, setPropertyValue] = useState('');
  const [mortgageAmount, setMortgageAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState(20); // default value is 20 years

  const handleSliderChange = (event) => {
    setLoanTerm(event.target.value);
  }

  return (
    <div>
      <label htmlFor="property-value">Hodnota nemovitosti:</label>
      <input
        id="property-value"
        type="text"
        value={propertyValue}
        onChange={(event) => setPropertyValue(event.target.value)}
      />
      <br />
      <label htmlFor="mortgage-amount">Hypotéka:</label>
      <input
        id="mortgage-amount"
        type="text"
        value={mortgageAmount}
        onChange={(event) => setMortgageAmount(event.target.value)}
      />
      <br />
      <label htmlFor="loan-term">Doba splácení (roky):</label>
      <input
        id="loan-term"
        type="range"
        min="1"
        max="50"
        value={loanTerm}
        onChange={handleSliderChange}
      />
      <br />
      <label htmlFor="loan-term-value">{loanTerm} let</label>
      <br />
      <button> Vypočítat</button>
    </div>
  );
}