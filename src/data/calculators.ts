import { CalculatorConfig } from '../types';

export const CATEGORIES = [
  { name: 'Finance', description: 'EMI loan rates, mortgage payment projections, and structural debts.', icon: 'DollarSign', slug: 'finance' },
  { name: 'Investment', description: 'SIP projections, compound interest models, and wealth metrics.', icon: 'TrendingUp', slug: 'investment' },
  { name: 'Health', description: 'Body Mass Index (BMI), pregnancy cycles, and reproductive dates.', icon: 'Heart', slug: 'health' },
  { name: 'Math', description: 'Percentages, triangle angles, circles, and core geometric equations.', icon: 'Percent', slug: 'math' },
  { name: 'Science', description: 'Physical forces, chemical concentrations, and molecular formulas.', icon: 'FlaskConical', slug: 'science' },
  { name: 'Engineering', description: 'Ohm\'s Law circuits, voltage parameters, and electric values.', icon: 'Cpu', slug: 'engineering' },
  { name: 'Construction', description: 'Paint coverage, concrete volume requirements, and material loads.', icon: 'Wrench', slug: 'construction' },
  { name: 'Fitness', description: 'Daily active calories, basal metabolic rates, and lifestyle metrics.', icon: 'Activity', slug: 'fitness' },
  { name: 'Education', description: 'Grade point averages, weightings, and academic score metrics.', icon: 'Award', slug: 'education' },
  { name: 'Business', description: 'Retail pricing margins, discount markups, and business profits.', icon: 'Briefcase', slug: 'business' },
  { name: 'Daily Life', description: 'Age trackers, calendars, interval difference count downs.', icon: 'Compass', slug: 'daily-life' },
];

export const CALCULATORS: CalculatorConfig[] = [
  {
    id: 'loan-calculator',
    name: 'Loan EMI Calculator',
    category: 'Finance',
    description: 'Calculate your Monthly EMI, total interest payable, and repayment schedule with visual charts.',
    icon: 'CreditCard',
    fields: [
      { name: 'amount', label: 'Loan Amount', type: 'number', defaultValue: 100000, min: 1000, max: 10000000, step: 1000, unit: '$' },
      { name: 'rate', label: 'Interest Rate (Annual)', type: 'number', defaultValue: 8.5, min: 1, max: 30, step: 0.1, unit: '%' },
      { name: 'tenure', label: 'Loan Tenure', type: 'number', defaultValue: 15, min: 1, max: 40, step: 1, unit: 'Years' },
    ],
    calculate: (inputs) => {
      const p = Number(inputs.amount) || 0;
      const r = (Number(inputs.rate) || 0) / 12 / 100;
      const n = (Number(inputs.tenure) || 0) * 12;

      if (p <= 0 || r < 0 || n <= 0) {
        return { emi: 0, totalInterest: 0, totalPayment: 0, principalPercent: 0, interestPercent: 0 };
      }

      const emi = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - p;
      const principalPercent = Math.round((p / totalPayment) * 100) || 0;
      const interestPercent = 100 - principalPercent;

      return {
        emi: Math.round(emi * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalPayment: Math.round(totalPayment * 100) / 100,
        principal: p,
        principalPercent,
        interestPercent,
      };
    },
    chartConfig: {
      type: 'pie',
      labels: {
        principal: 'Principal Amount',
        totalInterest: 'Total Interest',
      },
      colors: {
        principal: '#2563EB',
        totalInterest: '#F59E0B',
      },
    },
    aiPromptTemplate: 'Analyze a loan of ${amount} at an interest rate of {rate}% over {tenure} years. The calculated EMI is ${emi}, with a total interest of ${totalInterest}. Offer 3 actionable, smart financial tips to reduce their tenure or interest payload.',
  },
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Home Loan Calculator',
    category: 'Finance',
    description: 'Calculate your total monthly mortgage payment including principal, interest, taxes, and home insurance.',
    icon: 'Home',
    fields: [
      { name: 'homeValue', label: 'Home Purchase Price', type: 'number', defaultValue: 350000, min: 10000, max: 10000000, step: 5000, unit: '$' },
      { name: 'downPayment', label: 'Down Payment Amount', type: 'number', defaultValue: 70000, min: 0, max: 10000000, step: 1000, unit: '$' },
      { name: 'rate', label: 'Annual Interest Rate', type: 'number', defaultValue: 6.8, min: 0.1, max: 30, step: 0.1, unit: '%' },
      { name: 'tenure', label: 'Mortgage Term', type: 'number', defaultValue: 30, min: 5, max: 40, step: 1, unit: 'Years' },
    ],
    calculate: (inputs) => {
      const price = Number(inputs.homeValue) || 0;
      const down = Number(inputs.downPayment) || 0;
      const rAnnual = Number(inputs.rate) || 0;
      const tenure = Number(inputs.tenure) || 30;

      const p = Math.max(0, price - down);
      const r = rAnnual / 12 / 100;
      const n = tenure * 12;

      let piPayment = 0;
      if (p > 0) {
        piPayment = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const taxMonthly = (price * 0.0125) / 12;
      const insMonthly = 100;

      const totalMonthly = piPayment + taxMonthly + insMonthly;

      return {
        monthlyPI: Math.round(piPayment * 100) / 100,
        monthlyTax: Math.round(taxMonthly * 100) / 100,
        monthlyInsurance: Math.round(insMonthly * 100) / 100,
        totalMonthly: Math.round(totalMonthly * 100) / 100,
        loanAmount: p,
      };
    },
    chartConfig: {
      type: 'comparison',
      labels: {
        monthlyPI: 'Principal & Interest ($)',
        monthlyTax: 'Property Tax ($)',
        monthlyInsurance: 'Home Insurance ($)',
      },
      colors: {
        monthlyPI: '#2563EB',
        monthlyTax: '#EF4444',
        monthlyInsurance: '#F59E0B',
      },
    },
    aiPromptTemplate: 'Analyze a home purchase price ${homeValue} with down payment ${downPayment} leading to mortgage loan ${loanAmount} at {rate}% annual interest for {tenure} years. Monthly payment including taxes & insurance is ${totalMonthly}. Give custom recommendations on home buying and escrow strategies.',
  },
  {
    id: 'sip-calculator',
    name: 'SIP Investment Calculator',
    category: 'Investment',
    description: 'Project the future value of your Systematic Investment Plan (SIP) and estimate wealth gained.',
    icon: 'TrendingUp',
    fields: [
      { name: 'monthlyInvestment', label: 'Monthly Investment', type: 'number', defaultValue: 500, min: 10, max: 100000, step: 50, unit: '$' },
      { name: 'returnRate', label: 'Expected Return Rate (Annual)', type: 'number', defaultValue: 12, min: 1, max: 50, step: 0.5, unit: '%' },
      { name: 'tenure', label: 'Investment Period', type: 'number', defaultValue: 10, min: 1, max: 40, step: 1, unit: 'Years' },
    ],
    calculate: (inputs) => {
      const p = Number(inputs.monthlyInvestment) || 0;
      const r = (Number(inputs.returnRate) || 0) / 12 / 100;
      const n = (Number(inputs.tenure) || 0) * 12;

      if (p <= 0 || r < 0 || n <= 0) {
        return { investedAmount: 0, estReturns: 0, totalValue: 0, investedPercent: 0, returnsPercent: 0 };
      }

      let totalValue = 0;
      if (r === 0) {
        totalValue = p * n;
      } else {
        totalValue = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      }

      const investedAmount = p * n;
      const estReturns = totalValue - investedAmount;
      const investedPercent = Math.round((investedAmount / totalValue) * 100) || 0;
      const returnsPercent = 100 - investedPercent;

      return {
        investedAmount: Math.round(investedAmount),
        estReturns: Math.round(estReturns),
        totalValue: Math.round(totalValue),
        investedPercent,
        returnsPercent,
      };
    },
    chartConfig: {
      type: 'pie',
      labels: {
        investedAmount: 'Total Invested Amount',
        estReturns: 'Estimated Returns',
      },
      colors: {
        investedAmount: '#2563EB',
        estReturns: '#10B981',
      },
    },
    aiPromptTemplate: 'Analyze a Systematic Investment Plan (SIP) of ${monthlyInvestment} per month for {tenure} years at {returnRate}% expected returns. The final wealth is ${totalValue} with gains of ${estReturns}. Explain compound interest and how continuing for 5 more years changes the output.',
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Growth Calculator',
    category: 'Investment',
    description: 'Determine the compound interest growth of your principal amount over a custom period with recurring growth.',
    icon: 'TrendingUp',
    fields: [
      { name: 'principal', label: 'Initial Investment', type: 'number', defaultValue: 10000, min: 100, max: 100000000, step: 100, unit: '$' },
      { name: 'rate', label: 'Annual Interest Rate', type: 'number', defaultValue: 6.5, min: 0.1, max: 50, step: 0.1, unit: '%' },
      { name: 'years', label: 'Period (Years)', type: 'number', defaultValue: 10, min: 1, max: 50, step: 1, unit: 'Years' },
      { name: 'frequency', label: 'Compounding Frequency', type: 'select', defaultValue: '12', options: [
        { label: 'Annually (1/yr)', value: '1' },
        { label: 'Semi-Annually (2/yr)', value: '2' },
        { label: 'Quarterly (4/yr)', value: '4' },
        { label: 'Monthly (12/yr)', value: '12' },
      ]},
    ],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const r = (Number(inputs.rate) || 0) / 100;
      const t = Number(inputs.years) || 0;
      const n = Number(inputs.frequency) || 1;

      if (p <= 0 || r < 0 || t <= 0) {
        return { totalBalance: 0, interestGained: 0, principalPercent: 0, interestPercent: 0 };
      }

      const totalBalance = p * Math.pow(1 + r / n, n * t);
      const interestGained = totalBalance - p;
      const principalPercent = Math.round((p / totalBalance) * 100) || 0;
      const interestPercent = 100 - principalPercent;

      return {
        totalBalance: Math.round(totalBalance * 100) / 100,
        interestGained: Math.round(interestGained * 100) / 100,
        investedAmount: p,
        principalPercent,
        interestPercent,
      };
    },
    chartConfig: {
      type: 'pie',
      labels: {
        investedAmount: 'Principal Amount',
        interestGained: 'Compound Interest Earned',
      },
      colors: {
        investedAmount: '#3B82F6',
        interestGained: '#10B981',
      },
    },
    aiPromptTemplate: 'Explain compound interest on initial principal ${principal} at {rate}% compounded {frequency} times a year for {years} years. Final value is ${totalBalance} with gains of ${interestGained}. Discuss the "Rule of 72" in wealth building.',
  },
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    category: 'Investment',
    description: 'Calculate basic non-compounding interest returns over time with simple linear progression.',
    icon: 'TrendingUp',
    fields: [
      { name: 'principal', label: 'Principal Amount', type: 'number', defaultValue: 10000, min: 100, max: 10000000, step: 100, unit: '$' },
      { name: 'rate', label: 'Annual Interest Rate', type: 'number', defaultValue: 5, min: 0.1, max: 50, step: 0.1, unit: '%' },
      { name: 'years', label: 'Period (Years)', type: 'number', defaultValue: 5, min: 1, max: 50, step: 1, unit: 'Years' },
    ],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const r = (Number(inputs.rate) || 0) / 100;
      const t = Number(inputs.years) || 0;

      const interestGained = p * r * t;
      const totalBalance = p + interestGained;
      const principalPercent = Math.round((p / totalBalance) * 100) || 0;
      const interestPercent = 100 - principalPercent;

      return {
        totalBalance: Math.round(totalBalance * 100) / 100,
        interestGained: Math.round(interestGained * 100) / 100,
        investedAmount: p,
        principalPercent,
        interestPercent,
      };
    },
    chartConfig: {
      type: 'pie',
      labels: {
        investedAmount: 'Principal Amount',
        interestGained: 'Simple Interest Earned',
      },
      colors: {
        investedAmount: '#3B82F6',
        interestGained: '#10B981',
      },
    },
    aiPromptTemplate: 'Explain simple interest returns on a principal of ${principal} at {rate}% over {years} years. Contrast this with compound growth.',
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'Math',
    description: 'Solve classic percentage queries: percentages of values, increases, ratios, and fractions.',
    icon: 'Percent',
    fields: [
      { name: 'type', label: 'Solve For', type: 'select', defaultValue: 'part', options: [
        { label: 'What is X% of Y?', value: 'part' },
        { label: 'X is what % of Y?', value: 'percent' },
        { label: 'Percentage Increase/Decrease from X to Y', value: 'change' },
      ]},
      { name: 'x', label: 'Value X', type: 'number', defaultValue: 20, min: -1000000, max: 1000000, step: 1 },
      { name: 'y', label: 'Value Y', type: 'number', defaultValue: 250, min: -1000000, max: 1000000, step: 1 },
    ],
    calculate: (inputs) => {
      const x = Number(inputs.x) || 0;
      const y = Number(inputs.y) || 0;
      const type = inputs.type || 'part';

      let result = 0;
      let statement = '';

      if (type === 'part') {
        result = (x / 100) * y;
        statement = `${x}% of ${y} is ${Math.round(result * 100) / 100}`;
      } else if (type === 'percent') {
        if (y === 0) {
          result = 0;
          statement = 'Cannot divide by zero';
        } else {
          result = (x / y) * 100;
          statement = `${x} is ${Math.round(result * 100) / 100}% of ${y}`;
        }
      } else if (type === 'change') {
        if (x === 0) {
          result = 0;
          statement = 'Cannot calculate percentage change from zero';
        } else {
          result = ((y - x) / x) * 100;
          const direction = result >= 0 ? 'increase' : 'decrease';
          statement = `Moving from ${x} to ${y} is a ${Math.abs(Math.round(result * 100) / 100)}% ${direction}`;
        }
      }

      return {
        result: Math.round(result * 100) / 100,
        statement,
        x,
        y,
      };
    },
    aiPromptTemplate: 'Explain this percentage calculation in daily terms: {statement}. Offer a real-world example (e.g. stores, budgets) illustrating this math.',
  },
  {
    id: 'average-calculator',
    name: 'Average & Stats (Mean/Median/Mode)',
    category: 'Math',
    description: 'Calculate average, mean, median, mode, and range for a custom sequence of numbers.',
    icon: 'Percent',
    fields: [
      { name: 'numbers', label: 'Enter Numbers (separated by commas)', type: 'text', defaultValue: '10, 15, 20, 20, 35, 50, 75' },
    ],
    calculate: (inputs) => {
      const inputStr = inputs.numbers || '';
      const arr = inputStr.split(',')
        .map((s: string) => Number(s.trim()))
        .filter((n: number) => !isNaN(n));

      if (arr.length === 0) {
        return { mean: 0, median: 0, mode: 0, range: 0, count: 0 };
      }

      // Mean
      const sum = arr.reduce((a, b) => a + b, 0);
      const mean = sum / arr.length;

      // Median
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

      // Mode
      const freqs: Record<number, number> = {};
      let maxFreq = 0;
      let mode = sorted[0];
      arr.forEach((n) => {
        freqs[n] = (freqs[n] || 0) + 1;
        if (freqs[n] > maxFreq) {
          maxFreq = freqs[n];
          mode = n;
        }
      });

      // Range
      const range = sorted[sorted.length - 1] - sorted[0];

      return {
        mean: Math.round(mean * 100) / 100,
        median: Math.round(median * 100) / 100,
        mode: Math.round(mode * 100) / 100,
        range: Math.round(range * 100) / 100,
        count: arr.length,
      };
    },
    aiPromptTemplate: 'Analyze the statistal sequence input of {numbers}. The Mean is {mean}, Median is {median}, Mode is {mode}, Range is {range}. Explain what these statistics represent in a practical data set context.',
  },
  {
    id: 'triangle-calculator',
    name: 'Triangle Geometry Calculator',
    category: 'Math',
    description: 'Compute base area, perimeter, angles, and hypotenuse of any triangle using Pythagorean theorems.',
    icon: 'Percent',
    fields: [
      { name: 'base', label: 'Triangle Base (Side A)', type: 'number', defaultValue: 3, min: 0.1, max: 10000, step: 0.1 },
      { name: 'height', label: 'Triangle Height (Side B)', type: 'number', defaultValue: 4, min: 0.1, max: 10000, step: 0.1 },
    ],
    calculate: (inputs) => {
      const a = Number(inputs.base) || 3;
      const b = Number(inputs.height) || 4;

      const area = 0.5 * a * b;
      const c = Math.sqrt(a * a + b * b);
      const perimeter = a + b + c;

      // Angles in degrees
      const angleA = (Math.asin(a / c) * 180) / Math.PI;
      const angleB = (Math.asin(b / c) * 180) / Math.PI;

      return {
        area: Math.round(area * 100) / 100,
        hypotenuse: Math.round(c * 100) / 100,
        perimeter: Math.round(perimeter * 100) / 100,
        angleA: Math.round(angleA * 10) / 10,
        angleB: Math.round(angleB * 10) / 10,
      };
    },
    chartConfig: {
      type: 'comparison',
      labels: {
        area: 'Area (sq units)',
        hypotenuse: 'Hypotenuse (c)',
        perimeter: 'Perimeter (total)',
      },
    },
    aiPromptTemplate: 'Explain Pythagorean geometry on a right triangle with base {base} and height {height}. Discuss how hypotenuse {hypotenuse} relates to trigonometric ratios.',
  },
  {
    id: 'circle-calculator',
    name: 'Circle Area & Perimeter Calculator',
    category: 'Math',
    description: 'Calculate circle area, circumference, diameter, and sector segments instantly using mathematical Pi (π).',
    icon: 'Percent',
    fields: [
      { name: 'radius', label: 'Circle Radius (r)', type: 'number', defaultValue: 5, min: 0.1, max: 10000, step: 0.1 },
    ],
    calculate: (inputs) => {
      const r = Number(inputs.radius) || 5;

      const diameter = r * 2;
      const area = Math.PI * r * r;
      const circumference = Math.PI * diameter;

      return {
        diameter: Math.round(diameter * 100) / 100,
        area: Math.round(area * 100) / 100,
        circumference: Math.round(circumference * 100) / 100,
      };
    },
    chartConfig: {
      type: 'comparison',
      labels: {
        radius: 'Radius (r)',
        diameter: 'Diameter (d)',
        circumference: 'Circumference (C)',
      },
    },
    aiPromptTemplate: 'Explain circular geometry metrics where radius is {radius}, generating area {area} and circumference {circumference}. Elaborate on the historical importance of the constant Pi (π).',
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Health Calculator',
    category: 'Health',
    description: 'Calculate your Body Mass Index (BMI), health status, ideal weight, and health recommendation.',
    icon: 'Activity',
    fields: [
      { name: 'weight', label: 'Weight', type: 'number', defaultValue: 70, min: 10, max: 300, step: 1, unit: 'kg' },
      { name: 'height', label: 'Height', type: 'number', defaultValue: 175, min: 50, max: 250, step: 1, unit: 'cm' },
    ],
    calculate: (inputs) => {
      const w = Number(inputs.weight) || 0;
      const h = (Number(inputs.height) || 0) / 100; // in meters

      if (w <= 0 || h <= 0) {
        return { bmi: 0, status: 'Invalid inputs', color: 'text-gray-500', idealRange: '' };
      }

      const bmi = Math.round((w / (h * h)) * 10) / 10;
      let status = '';
      let color = '';
      let advice = '';

      if (bmi < 18.5) {
        status = 'Underweight';
        color = 'text-blue-500';
        advice = 'A nutrient-rich diet with balanced calories is advised.';
      } else if (bmi >= 18.5 && bmi < 24.9) {
        status = 'Normal weight';
        color = 'text-green-500';
        advice = 'Great job! Maintain your balanced nutrition and regular physical activity.';
      } else if (bmi >= 25 && bmi < 29.9) {
        status = 'Overweight';
        color = 'text-yellow-500';
        advice = 'Consider a balanced portion layout and moderate cardio exercises.';
      } else {
        status = 'Obese';
        color = 'text-red-500';
        advice = 'Consulting a healthcare professional for custom fitness plans is recommended.';
      }

      const minIdeal = Math.round(18.5 * (h * h) * 10) / 10;
      const maxIdeal = Math.round(24.9 * (h * h) * 10) / 10;

      return {
        bmi,
        status,
        color,
        advice,
        idealRange: `${minIdeal} kg - ${maxIdeal} kg`,
        weight: w,
        idealMin: minIdeal,
        idealMax: maxIdeal,
      };
    },
    chartConfig: {
      type: 'comparison',
      labels: {
        weight: 'Your Weight (kg)',
        idealMin: 'Ideal Weight Min (kg)',
        idealMax: 'Ideal Weight Max (kg)',
      },
      colors: {
        weight: '#EF4444',
        idealMin: '#10B981',
        idealMax: '#10B981',
      },
    },
    aiPromptTemplate: 'The user has a height of {height} cm and weight of {weight} kg, giving a BMI of {bmi} ({status}). Generate a friendly health briefing summarizing nutrition, ideal caloric targets, and motivational advice.',
  },
  {
    id: 'pregnancy-calculator',
    name: 'Pregnancy Due Date Calculator',
    category: 'Health',
    description: 'Calculate your estimated baby due date, current gestational week, and pregnancy milestones.',
    icon: 'Heart',
    fields: [
      { name: 'lastPeriod', label: 'First Day of Last Period (LMP)', type: 'text', defaultValue: '2026-01-01', placeholder: 'YYYY-MM-DD' },
      { name: 'cycleLength', label: 'Average Cycle Length (Days)', type: 'number', defaultValue: 28, min: 20, max: 45, step: 1 },
    ],
    calculate: (inputs) => {
      const lmpStr = inputs.lastPeriod || '2026-01-01';
      const cycle = Number(inputs.cycleLength) || 28;
      const lmp = new Date(lmpStr);

      if (isNaN(lmp.getTime())) {
        return { gestationalWeeks: 0, gestationalDays: 0, dueDate: 'Invalid Date' };
      }

      // Standard Naegele's rule: LMP + 280 days (for a 28-day cycle, adjusted for custom cycle)
      const adjustedDays = 280 + (cycle - 28);
      const dueDate = new Date(lmp);
      dueDate.setDate(dueDate.getDate() + adjustedDays);

      const today = new Date();
      const diffMs = today.getTime() - lmp.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let gestationalWeeks = Math.floor(diffDays / 7);
      let gestationalDays = diffDays % 7;

      if (gestationalWeeks < 0) {
        gestationalWeeks = 0;
        gestationalDays = 0;
      }

      return {
        dueDate: dueDate.toISOString().split('T')[0],
        gestationalWeeks,
        gestationalDays,
        conceptionDate: new Date(lmp.getTime() + (cycle - 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
    },
    aiPromptTemplate: 'The user has LMP on {lastPeriod} and a cycle of {cycleLength} days. Estimated Due Date is {dueDate}. Gestation state: {gestationalWeeks} weeks and {gestationalDays} days. Generate a reassuring pregnancy development checklist.',
  },
  {
    id: 'ovulation-calculator',
    name: 'Ovulation & Fertility Tracker',
    category: 'Health',
    description: 'Track your estimated ovulation day, fertile window calendar, and upcoming cycles.',
    icon: 'Heart',
    fields: [
      { name: 'lastPeriod', label: 'First Day of Last Period (LMP)', type: 'text', defaultValue: '2026-01-01', placeholder: 'YYYY-MM-DD' },
      { name: 'cycleLength', label: 'Average Cycle Length (Days)', type: 'number', defaultValue: 28, min: 20, max: 45, step: 1 },
    ],
    calculate: (inputs) => {
      const lmpStr = inputs.lastPeriod || '2026-01-01';
      const cycle = Number(inputs.cycleLength) || 28;
      const lmp = new Date(lmpStr);

      if (isNaN(lmp.getTime())) {
        return { ovulationDate: 'Invalid Date', fertileStart: 'Invalid Date', fertileEnd: 'Invalid Date' };
      }

      // Ovulation generally happens 14 days before the next period starts
      const nextPeriod = new Date(lmp.getTime() + cycle * 24 * 60 * 60 * 1000);
      const ovulation = new Date(nextPeriod.getTime() - 14 * 24 * 60 * 60 * 1000);

      const fertileStart = new Date(ovulation.getTime() - 5 * 24 * 60 * 60 * 1000); // Fertile window starts 5 days before ovulation
      const fertileEnd = new Date(ovulation.getTime() + 1 * 24 * 60 * 60 * 1000); // Fertile window ends 1 day after ovulation

      return {
        ovulationDate: ovulation.toISOString().split('T')[0],
        fertileStart: fertileStart.toISOString().split('T')[0],
        fertileEnd: fertileEnd.toISOString().split('T')[0],
        nextPeriodDate: nextPeriod.toISOString().split('T')[0],
      };
    },
    aiPromptTemplate: 'Track fertility for last period {lastPeriod} and cycle length {cycleLength} days. Ovulation is predicted on {ovulationDate} with fertile window from {fertileStart} to {fertileEnd}. Explain fertile cycle biology.',
  },
  {
    id: 'physics-force-calculator',
    name: 'Physics Force Calculator (F = ma)',
    category: 'Science',
    description: 'Calculate physical Force (F), Mass (m), or Acceleration (a) using Newton\'s Second Law of Motion.',
    icon: 'FlaskConical',
    fields: [
      { name: 'solveFor', label: 'Solve For', type: 'select', defaultValue: 'f', options: [
        { label: 'Force (F = m * a)', value: 'f' },
        { label: 'Mass (m = F / a)', value: 'm' },
        { label: 'Acceleration (a = F / m)', value: 'a' },
      ]},
      { name: 'mass', label: 'Mass (kilograms)', type: 'number', defaultValue: 10, min: 0.001, max: 1000000, step: 1, unit: 'kg' },
      { name: 'accel', label: 'Acceleration (m/s²)', type: 'number', defaultValue: 9.8, min: 0.001, max: 10000, step: 0.1, unit: 'm/s²' },
      { name: 'force', label: 'Force (Newtons)', type: 'number', defaultValue: 98, min: 0.001, max: 10000000, step: 1, unit: 'N' },
    ],
    calculate: (inputs) => {
      const mode = inputs.solveFor || 'f';
      let m = Number(inputs.mass) || 10;
      let a = Number(inputs.accel) || 9.8;
      let f = Number(inputs.force) || 98;

      let solved = '';
      if (mode === 'f') {
        f = m * a;
        solved = `Force (F) = ${Math.round(f * 100) / 100} N`;
      } else if (mode === 'm') {
        if (a === 0) a = 0.001;
        m = f / a;
        solved = `Mass (m) = ${Math.round(m * 100) / 100} kg`;
      } else if (mode === 'a') {
        if (m === 0) m = 0.001;
        a = f / m;
        solved = `Acceleration (a) = ${Math.round(a * 100) / 100} m/s²`;
      }

      return {
        f: Math.round(f * 100) / 100,
        m: Math.round(m * 100) / 100,
        a: Math.round(a * 100) / 100,
        solved,
      };
    },
    aiPromptTemplate: 'An object has parameters Mass={m}kg, Acceleration={a}m/s², producing Force={f} Newtons. Provide a tutorial on physics forces, mechanical potential energy, and real-world inertia examples.',
  },
  {
    id: 'chemistry-molarity-calculator',
    name: 'Chemistry Molarity Calculator',
    category: 'Science',
    description: 'Determine chemical solution molarity, solute mass, or volume parameters for laboratory testing.',
    icon: 'FlaskConical',
    fields: [
      { name: 'mass', label: 'Solute Mass (grams)', type: 'number', defaultValue: 5.84, min: 0.001, max: 100000, step: 0.01, unit: 'g' },
      { name: 'molarMass', label: 'Solute Molar Mass (g/mol)', type: 'number', defaultValue: 58.44, min: 0.1, max: 1000, step: 0.01, unit: 'g/mol' },
      { name: 'volume', label: 'Solution Volume (liters)', type: 'number', defaultValue: 0.25, min: 0.001, max: 1000, step: 0.01, unit: 'L' },
    ],
    calculate: (inputs) => {
      const mass = Number(inputs.mass) || 0;
      const mm = Number(inputs.molarMass) || 1;
      const vol = Number(inputs.volume) || 1;

      // moles = mass / molar mass
      const moles = mm === 0 ? 0 : mass / mm;
      // molarity = moles / liters
      const molarity = vol === 0 ? 0 : moles / vol;

      return {
        moles: Math.round(moles * 1000) / 1000,
        molarity: Math.round(molarity * 1000) / 1000,
        mass,
        volume: vol,
      };
    },
    chartConfig: {
      type: 'comparison',
      labels: {
        moles: 'Solute Moles (mol)',
        molarity: 'Solution Molarity (M)',
      },
    },
    aiPromptTemplate: 'Explain molarity for chemical solution with solute mass {mass}g (molar mass {molarMass}g/mol) dissolved in {volume} L of liquid, yielding molarity {molarity} M. Offer a laboratory dilution tip.',
  },
  {
    id: 'ohms-law-calculator',
    name: 'Ohm\'s Law Calculator',
    category: 'Engineering',
    description: 'Calculate voltage, current, resistance, or power using Ohm\'s Law equations.',
    icon: 'Cpu',
    fields: [
      { name: 'solveFor', label: 'Solve For', type: 'select', defaultValue: 'v', options: [
        { label: 'Voltage (V = I * R)', value: 'v' },
        { label: 'Current (I = V / R)', value: 'i' },
        { label: 'Resistance (R = V / I)', value: 'r' },
      ]},
      { name: 'v', label: 'Voltage (Volts)', type: 'number', defaultValue: 12, min: 0.001, max: 10000, step: 0.1, unit: 'V' },
      { name: 'i', label: 'Current (Amps)', type: 'number', defaultValue: 2, min: 0.001, max: 1000, step: 0.1, unit: 'A' },
      { name: 'r', label: 'Resistance (Ohms)', type: 'number', defaultValue: 6, min: 0.001, max: 1000000, step: 0.1, unit: 'Ω' },
    ],
    calculate: (inputs) => {
      const mode = inputs.solveFor || 'v';
      let v = Number(inputs.v) || 0;
      let i = Number(inputs.i) || 0;
      let r = Number(inputs.r) || 0;

      let solved = '';
      let power = 0;

      if (mode === 'v') {
        v = Math.round(i * r * 1000) / 1000;
        solved = `Voltage (V) = ${v} V`;
        power = v * i;
      } else if (mode === 'i') {
        if (r === 0) r = 0.001;
        i = Math.round((v / r) * 1000) / 1000;
        solved = `Current (I) = ${i} A`;
        power = v * i;
      } else if (mode === 'r') {
        if (i === 0) i = 0.001;
        r = Math.round((v / i) * 1000) / 1000;
        solved = `Resistance (R) = ${r} Ω`;
        power = v * i;
      }

      return {
        v: Math.round(v * 100) / 100,
        i: Math.round(i * 100) / 100,
        r: Math.round(r * 100) / 100,
        solved,
        power: Math.round(power * 100) / 100,
      };
    },
    aiPromptTemplate: 'The circuit values are Voltage={v}V, Current={i}A, Resistance={r}Ω, and Power={power}W. Explain how these relate physically and give a brief tutorial on basic circuit layout safety.',
  },
  {
    id: 'paint-calculator',
    name: 'Paint Area & Volume Calculator',
    category: 'Construction',
    description: 'Determine the exact surface area of walls and how many gallons of paint are needed for your room.',
    icon: 'Wrench',
    fields: [
      { name: 'length', label: 'Wall Length', type: 'number', defaultValue: 20, min: 1, max: 500, step: 1, unit: 'ft' },
      { name: 'height', label: 'Wall Height', type: 'number', defaultValue: 9, min: 1, max: 50, step: 0.5, unit: 'ft' },
      { name: 'coats', label: 'Coats of Paint', type: 'number', defaultValue: 2, min: 1, max: 5, step: 1 },
      { name: 'doors', label: 'Number of Doors', type: 'number', defaultValue: 1, min: 0, max: 10, step: 1 },
      { name: 'windows', label: 'Number of Windows', type: 'number', defaultValue: 2, min: 0, max: 20, step: 1 },
    ],
    calculate: (inputs) => {
      const len = Number(inputs.length) || 0;
      const h = Number(inputs.height) || 0;
      const coats = Number(inputs.coats) || 1;
      const doors = Number(inputs.doors) || 0;
      const windows = Number(inputs.windows) || 0;

      const totalWallArea = len * 4 * h;
      const doorReduction = doors * 21;
      const windowReduction = windows * 15;

      let paintArea = totalWallArea - doorReduction - windowReduction;
      if (paintArea < 0) paintArea = 0;

      const totalPaintArea = paintArea * coats;
      const gallonsRequired = Math.round((totalPaintArea / 350) * 10) / 10;

      return {
        baseArea: Math.round(paintArea),
        totalArea: Math.round(totalPaintArea),
        gallons: gallonsRequired,
        liters: Math.round(gallonsRequired * 3.78541 * 10) / 10,
      };
    },
    chartConfig: {
      type: 'comparison',
      labels: {
        baseArea: 'Single Coat Area (sq ft)',
        totalArea: 'Total Multi-Coat Area (sq ft)',
      },
    },
    aiPromptTemplate: 'An individual wants to paint a room with {length} ft wall length, {height} ft wall height, applying {coats} coats. Total area is {totalArea} sq ft. Gallons needed: {gallons} ({liters} liters). Generate a professional paint masterclass checklist.',
  },
  {
    id: 'concrete-calculator',
    name: 'Concrete Volume Calculator',
    category: 'Construction',
    description: 'Determine the total volume of concrete required in cubic yards and standard 80lb bags for slabs or walls.',
    icon: 'Wrench',
    fields: [
      { name: 'length', label: 'Slab Length', type: 'number', defaultValue: 10, min: 1, max: 1000, step: 1, unit: 'ft' },
      { name: 'width', label: 'Slab Width', type: 'number', defaultValue: 10, min: 1, max: 1000, step: 1, unit: 'ft' },
      { name: 'thickness', label: 'Slab Thickness', type: 'number', defaultValue: 4, min: 1, max: 100, step: 1, unit: 'inches' },
    ],
    calculate: (inputs) => {
      const len = Number(inputs.length) || 0;
      const w = Number(inputs.width) || 0;
      const t = (Number(inputs.thickness) || 0) / 12; // thickness in feet

      const cuFt = len * w * t;
      const cuYd = cuFt / 27;

      // An 80lb bag covers approx 0.6 cubic feet
      const bags = cuFt / 0.6;

      return {
        cubicFeet: Math.round(cuFt * 10) / 10,
        cubicYards: Math.round(cuYd * 100) / 100,
        bags80lb: Math.ceil(bags),
      };
    },
    chartConfig: {
      type: 'comparison',
      labels: {
        cubicFeet: 'Volume (cu ft)',
        bags80lb: '80lb Bags Required',
      },
    },
    aiPromptTemplate: 'Calculate concrete load for length {length}ft, width {width}ft, thickness {thickness} inches. Total yards needed: {cubicYards}. Discuss masonry mixing ratios.',
  },
  {
    id: 'calorie-calculator',
    name: 'Calorie & BMR Intake Calculator',
    category: 'Fitness',
    description: 'Estimate your Basal Metabolic Rate (BMR) and daily calorie requirements based on your personal metrics.',
    icon: 'Activity',
    fields: [
      { name: 'gender', label: 'Gender', type: 'select', defaultValue: 'male', options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ]},
      { name: 'age', label: 'Age (Years)', type: 'number', defaultValue: 25, min: 1, max: 120, step: 1 },
      { name: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 70, min: 10, max: 300, step: 1, unit: 'kg' },
      { name: 'height', label: 'Height (cm)', type: 'number', defaultValue: 175, min: 50, max: 250, step: 1, unit: 'cm' },
      { name: 'activity', label: 'Activity Level', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Sedentary (Little/No exercise)', value: 'sedentary' },
        { label: 'Light (Exercise 1-3 days/week)', value: 'light' },
        { label: 'Moderate (Exercise 3-5 days/week)', value: 'moderate' },
        { label: 'Active (Hard exercise 6-7 days/week)', value: 'active' },
      ]},
    ],
    calculate: (inputs) => {
      const g = inputs.gender || 'male';
      const age = Number(inputs.age) || 25;
      const w = Number(inputs.weight) || 70;
      const h = Number(inputs.height) || 175;
      const act = inputs.activity || 'moderate';

      if (age <= 0 || w <= 0 || h <= 0) {
        return { bmr: 0, dailyCalories: 0 };
      }

      let bmr = 10 * w + 6.25 * h - 5 * age;
      if (g === 'male') {
        bmr += 5;
      } else {
        bmr -= 161;
      }

      const multipliers: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
      };

      const multiplier = multipliers[act] || 1.55;
      const dailyCalories = bmr * multiplier;

      return {
        bmr: Math.round(bmr),
        dailyCalories: Math.round(dailyCalories),
        gainWeight: Math.round(dailyCalories + 500),
        loseWeight: Math.round(dailyCalories - 500),
      };
    },
    chartConfig: {
      type: 'comparison',
      labels: {
        bmr: 'BMR (Resting Cal)',
        dailyCalories: 'Maintain Weight (Cal)',
        loseWeight: 'Lose 0.5kg/week (Cal)',
        gainWeight: 'Gain 0.5kg/week (Cal)',
      },
      colors: {
        bmr: '#6B7280',
        dailyCalories: '#3B82F6',
        loseWeight: '#EF4444',
        gainWeight: '#10B981',
      },
    },
    aiPromptTemplate: 'An individual of gender {gender}, age {age}, weight {weight}kg, height {height}cm has a resting BMR of {bmr} and daily calorie needs of {dailyCalories} for maintaining weight. Offer a clean, customized macronutrient meal guide with balanced protein, fat, and carbs.',
  },
  {
    id: 'gpa-calculator',
    name: 'GPA & Grade Average Calculator',
    category: 'Education',
    description: 'Calculate your semester Grade Point Average (GPA) using credit hours and grade points.',
    icon: 'Award',
    fields: [
      { name: 'grades', label: 'Enter Grades & Credits (format: Grade,Credits; e.g. A,3; B,4; A,4)', type: 'text', defaultValue: 'A,3; B,4; A,4; C,3' },
    ],
    calculate: (inputs) => {
      const inputStr = inputs.grades || '';
      const items = inputStr.split(';');

      const scale: Record<string, number> = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0
      };

      let totalPoints = 0;
      let totalCredits = 0;

      items.forEach((item: string) => {
        const parts = item.split(',');
        if (parts.length === 2) {
          const letter = parts[0].trim().toUpperCase();
          const creds = Number(parts[1].trim());
          if (!isNaN(creds) && scale[letter] !== undefined) {
            totalPoints += scale[letter] * creds;
            totalCredits += creds;
          }
        }
      });

      const gpa = totalCredits === 0 ? 0 : totalPoints / totalCredits;

      return {
        gpa: Math.round(gpa * 100) / 100,
        totalCredits,
        totalPoints,
      };
    },
    chartConfig: {
      type: 'comparison',
      labels: {
        gpa: 'Calculated GPA Scale (4.0 Max)',
        totalCredits: 'Total Earned Credits',
      },
    },
    aiPromptTemplate: 'Explain academic scoring for a GPA of {gpa} on {totalCredits} total credits. Give a constructive recommendation for GPA enhancement.',
  },
  {
    id: 'profit-calculator',
    name: 'Business Profit Margin Calculator',
    category: 'Business',
    description: 'Determine gross profit margins, markup percentages, and total profit margins for retail or wholesale pricing models.',
    icon: 'Briefcase',
    fields: [
      { name: 'cost', label: 'Item Cost Price', type: 'number', defaultValue: 60, min: 0.01, max: 1000000, step: 1, unit: '$' },
      { name: 'sellingPrice', label: 'Selling Price (Revenue)', type: 'number', defaultValue: 100, min: 0.01, max: 1000000, step: 1, unit: '$' },
    ],
    calculate: (inputs) => {
      const c = Number(inputs.cost) || 0;
      const s = Number(inputs.sellingPrice) || 0;

      if (s <= 0) {
        return { grossProfit: 0, margin: 0, markup: 0 };
      }

      const grossProfit = s - c;
      const margin = (grossProfit / s) * 100;
      const markup = c === 0 ? 100 : (grossProfit / c) * 100;

      return {
        grossProfit: Math.round(grossProfit * 100) / 100,
        margin: Math.round(margin * 10) / 10,
        markup: Math.round(markup * 10) / 10,
        cost: c,
      };
    },
    chartConfig: {
      type: 'pie',
      labels: {
        cost: 'Item Cost',
        grossProfit: 'Gross Profit Margin',
      },
      colors: {
        cost: '#6B7280',
        grossProfit: '#10B981',
      },
    },
    aiPromptTemplate: 'Explain pricing structure where item cost is ${cost} and selling price is ${sellingPrice}, generating profit of ${grossProfit} with profit margin {margin}% and markup {markup}%. Offer competitive advice on how to improve this pricing model.',
  },
  {
    id: 'discount-calculator',
    name: 'Discount & Sale Price Calculator',
    category: 'Business',
    description: 'Calculate your exact final savings, sale discount price, and percentage cuts from original retail prices.',
    icon: 'Briefcase',
    fields: [
      { name: 'price', label: 'Original Retail Price', type: 'number', defaultValue: 150, min: 1, max: 1000000, step: 1, unit: '$' },
      { name: 'discountPercent', label: 'Discount Percentage (%)', type: 'number', defaultValue: 25, min: 1, max: 100, step: 1, unit: '%' },
    ],
    calculate: (inputs) => {
      const original = Number(inputs.price) || 0;
      const discount = Number(inputs.discountPercent) || 0;

      const savings = (original * discount) / 100;
      const finalPrice = original - savings;

      return {
        savings: Math.round(savings * 100) / 100,
        finalPrice: Math.round(finalPrice * 100) / 100,
        originalPrice: original,
      };
    },
    chartConfig: {
      type: 'pie',
      labels: {
        finalPrice: 'Discounted Final Price',
        savings: 'Savings Amount',
      },
      colors: {
        finalPrice: '#3B82F6',
        savings: '#10B981',
      },
    },
    aiPromptTemplate: 'Explain discount calculations for a retail item of original price ${price} with {discountPercent}% off. The final price is ${finalPrice} with a savings of ${savings}. Explain the psychological impact of pricing discount layouts.',
  },
  {
    id: 'date-calculator',
    name: 'Date Interval & Duration Calculator',
    category: 'Daily Life',
    description: 'Calculate the exact number of days, weeks, or months between two dates, or add/subtract days from a date.',
    icon: 'Compass',
    fields: [
      { name: 'startDate', label: 'Start Date', type: 'text', defaultValue: '2026-01-01', placeholder: 'YYYY-MM-DD' },
      { name: 'endDate', label: 'End Date', type: 'text', defaultValue: '2026-12-31', placeholder: 'YYYY-MM-DD' },
      { name: 'daysToAdd', label: 'Add or Subtract Days (Optional)', type: 'number', defaultValue: 0, min: -10000, max: 10000, step: 1 },
    ],
    calculate: (inputs) => {
      const start = new Date(inputs.startDate || '2026-01-01');
      const end = new Date(inputs.endDate || '2026-12-31');
      const daysToAdd = Number(inputs.daysToAdd) || 0;

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return { diffDays: 0, message: 'Invalid Date Format' };
      }

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);
      const remainingDays = diffDays % 7;

      const addedDate = new Date(start);
      addedDate.setDate(addedDate.getDate() + daysToAdd);
      const addedDateStr = addedDate.toISOString().split('T')[0];

      return {
        diffDays,
        weeks,
        remainingDays,
        addedDateStr,
        daysToAdd,
      };
    },
    chartConfig: {
      type: 'comparison',
      labels: {
        diffDays: 'Days Interval',
        weeks: 'Total Weeks',
      },
      colors: {
        diffDays: '#8B5CF6',
        weeks: '#10B981',
      },
    },
    aiPromptTemplate: 'Explain a calendar calculation where interval between {startDate} and {endDate} is {diffDays} days ({weeks} weeks). Also, adding {daysToAdd} days to {startDate} results in {addedDateStr}. Offer a productivity timeline management perspective.',
  },
  {
    id: 'age-calculator',
    name: 'Age & Birthday Calculator',
    category: 'Daily Life',
    description: 'Calculate your exact age in years, months, and days, and discover your next birthday countdown.',
    icon: 'Compass',
    fields: [
      { name: 'birthdate', label: 'Birthdate', type: 'text', defaultValue: '1998-05-15', placeholder: 'YYYY-MM-DD' },
    ],
    calculate: (inputs) => {
      const bDateStr = inputs.birthdate || '1998-05-15';
      const dob = new Date(bDateStr);
      const today = new Date();

      if (isNaN(dob.getTime())) {
        return { years: 0, months: 0, days: 0, message: 'Invalid Date Format' };
      }

      let years = today.getFullYear() - dob.getFullYear();
      let months = today.getMonth() - dob.getMonth();
      let days = today.getDate() - dob.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      const nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      if (nextBday < today) {
        nextBday.setFullYear(today.getFullYear() + 1);
      }
      const diffMs = nextBday.getTime() - today.getTime();
      const daysToBday = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      return {
        years,
        months,
        days,
        daysToBirthday: daysToBday,
        totalDays: Math.floor((today.getTime() - dob.getTime()) / (1000 * 60 * 60 * 24)),
      };
    },
    aiPromptTemplate: 'An individual born on {birthdate} is currently {years} years, {months} months, and {days} days old, with {daysToBirthday} days remaining until their next birthday. Generate a fascinating historic timeline highlight of things that happened during their lifetime.',
  },
];
