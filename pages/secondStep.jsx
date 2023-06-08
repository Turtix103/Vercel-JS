import { useState, useEffect } from 'react';
import styles from '../styles/button.module.css';
import Chart from 'chart.js/auto';
import { getFirestore, addDoc, getDoc, collection, query, where, getDocs, updateDoc, doc} from '@firebase/firestore';
import { database } from '@/FireBaseConfig';

export default function MortgageCalculator() {
  const [propertyValue, setPropertyValue] = useState('');
  const [mortgageAmount, setMortgageAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState(20); // default value is 20 years
  const [fixation, setFixation] = useState(2);
  const [monthlyPayments, setMonthlyPayments] = useState([]);

  useEffect(() => {
    if (monthlyPayments.length > 0) {
      renderChart();
    }
  }, [monthlyPayments]);

  const handleSliderChange1 = (event) => {
    setLoanTerm(event.target.value);
  };

  const handleSliderChange2 = (event) => {
    setFixation(event.target.value);
  };

  const c = collection(database, 'notes');
  
  useEffect(() => {
    // Retrieve saved inputs from local storage on component mount
    if (typeof window !== 'undefined') {
      setPropertyValue(localStorage.getItem('propertyValue') || '');
      setMortgageAmount(localStorage.getItem('mortgageAmount') || '');
      setLoanTerm(parseInt(localStorage.getItem('loanTerm')) || 20);
      setFixation(parseInt(localStorage.getItem('fixation')) || 2);
    }
  }, []);

  const calculateMonthlyPayments = async() => {
    // Convert values to numbers
    const propertyValueNum = parseFloat(propertyValue);
    const mortgageAmountNum = parseFloat(mortgageAmount);
    const loanTermNum = parseInt(loanTerm);
    const fixationNum = parseInt(fixation);

    // Check if all fields are filled
    if (!propertyValue || !mortgageAmount || isNaN(propertyValueNum) || isNaN(mortgageAmountNum)) {
      alert('Please fill in the property value and mortgage amount.');
      return;
    }

  const textArea1 = localStorage.getItem('textArea1');
  const textArea2 = localStorage.getItem('textArea2');
  const textArea3 = localStorage.getItem('textArea3');

  try {
    const q = query(c, where('Jméno', '==', textArea1), where('Příjmení', '==', textArea2), where('PSČ', '==', textArea3));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      console.log({ Jméno: textArea1, Příjmení: textArea2, PSČ: textArea3, mortgageAmountNum: mortgageAmountNum, mortgageAmountNum: mortgageAmountNum, loanTermNum: loanTermNum, fixationNum: fixationNum });
      await updateDoc(doc(database, "notes", querySnapshot.docs[0].id), { Jméno: textArea1, Příjmení: textArea2, PSČ: textArea3, mortgageAmountNum: mortgageAmountNum, mortgageAmountNum: mortgageAmountNum, loanTermNum: loanTermNum, fixationNum: fixationNum });
      } }
      catch(err) {console.log(err);}
      
    const interestRate = 0.04; // Assumed interest rate (4%)
    const loanTermMonths = loanTermNum * 12;
    const fixationMonths = fixationNum * 12;
    let remainingBalance = mortgageAmountNum;
    let monthlyInterestRate = interestRate / 12;
    const monthlyPayments = [];

    // Calculate the monthly payment based on the mortgage amount, loan term, and interest rate
    const monthlyPayment = calculateMonthlyPayment(mortgageAmountNum, loanTermMonths, monthlyInterestRate);

    for (let i = 0; i < loanTermMonths; i++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      if (remainingBalance < 0) {
        remainingBalance = 0;
      }

      const ltvRatio = (remainingBalance / propertyValueNum) * 100;
      monthlyPayments.push({ month: i + 1, payment: monthlyPayment.toFixed(2), interest: interestPayment.toFixed(2), amortization: principalPayment.toFixed(2), ltv: ltvRatio.toFixed(2) });
    }

    setMonthlyPayments(monthlyPayments);

    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const calculateMonthlyPayment = (mortgageAmount, loanTermMonths, monthlyInterestRate) => {
    const numerator = mortgageAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths);
    const denominator = Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1;
    return numerator / denominator;
  };

  const renderChart = () => {
    const labels = monthlyPayments.map((payment) => payment.month);
    const interestData = monthlyPayments.map((payment) => parseFloat(payment.interest));
    const amortizationData = monthlyPayments.map((payment) => parseFloat(payment.amortization));
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Úrok',
            data: interestData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
          {
            label: 'Amortizace',
            data: amortizationData,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Month',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Payment (Kč)',
            },
          },
        },
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="property-value" className={styles.label}>
            Property Value:
          </label>
          <input
            id="property-value"
            type="text"
            className={styles.input}
            value={propertyValue}
            onChange={(event) => setPropertyValue(event.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="mortgage-amount" className={styles.label}>
            Mortgage Amount:
          </label>
          <input
            id="mortgage-amount"
            type="text"
            className={styles.input}
            value={mortgageAmount}
            onChange={(event) => setMortgageAmount(event.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="loan-term" className={styles.label}>
            Loan Term (years):
          </label>
          <input
            id="loan-term"
            type="range"
            className={styles.input}
            min="1"
            max="10"
            value={loanTerm}
            onChange={handleSliderChange1}
          />
          <label htmlFor="loan-term-value" className={styles.label}>
            {loanTerm} years
          </label>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="fixation" className={styles.label}>
            Fixation:
          </label>
          <input
            id="fixation"
            type="range"
            className={styles.input}
            min="1"
            max="8"
            value={fixation}
            onChange={handleSliderChange2}
          />
          <label htmlFor="fixation-value" className={styles.label}>
            {fixation}
          </label>
        </div>
        <button className={styles.button} onClick={calculateMonthlyPayments}>
          Calculate
        </button>
  
        {monthlyPayments.length > 0 && (
          <div className={styles.result}>
            <h3>Monthly Payment Predictions:</h3>
            <div className={styles.scrollableContainer}>
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Payment (Kč)</th>
                    <th>LTV Ratio (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyPayments.map((payment) => (
                    <tr key={payment.month}>
                      <td>{payment.month}</td>
                      <td>{payment.payment}</td>
                      <td>{payment.ltv}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.chartContainer}>
              <canvas id="chart"></canvas>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}