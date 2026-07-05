import { CalculatorConfig } from '../types';

export const CATEGORIES = [
  { name: 'Finance', description: 'Loans, investments, tax, savings, interest, and retirement planning.', icon: 'DollarSign', slug: 'finance' },
  { name: 'Health', description: 'BMI, calories, body fat, water intake, and fitness calculators.', icon: 'Heart', slug: 'health' },
  { name: 'Math', description: 'Percentages, fractions, LCM/HCF, scientific calculations, and solver engines.', icon: 'Percent', slug: 'math' },
  { name: 'Date & Time', description: 'Age calculations, countdowns, date difference, and time tracking.', icon: 'Clock', slug: 'date-time' },
  { name: 'Converters', description: 'Instant conversion of length, weight, area, temperature, and speed.', icon: 'Scale', slug: 'converters' },
  { name: 'Programming', description: 'Binary, hex, decimal converters, hash generators, and formatters.', icon: 'Code', slug: 'programming' },
  { name: 'Construction', description: 'Concrete, paint, brick, tiles, and flooring calculators.', icon: 'Wrench', slug: 'construction' },
  { name: 'Engineering', description: 'Ohm\'s law, voltage, current, resistance, and electrical calculations.', icon: 'Cpu', slug: 'engineering' },
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

      let emi = 0;
      if (r === 0) {
        emi = p / n;
      } else {
        emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

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
    id: 'sip-calculator',
    name: 'SIP Investment Calculator',
    category: 'Finance',
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

      // SIP Formula: M = P * [ ( (1 + r)^n - 1 ) / r ] * (1 + r)
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
    id: 'gst-calculator',
    name: 'GST Tax Calculator',
    category: 'Finance',
    description: 'Add or remove Goods and Services Tax (GST) from amounts with customizable tax slabs.',
    icon: 'Percent',
    fields: [
      { name: 'amount', label: 'Net / Gross Amount', type: 'number', defaultValue: 1000, min: 1, max: 10000000, step: 10, unit: '$' },
      { name: 'rate', label: 'GST Rate', type: 'select', defaultValue: 18, options: [
        { label: '5%', value: 5 },
        { label: '12%', value: 12 },
        { label: '18%', value: 18 },
        { label: '28%', value: 28 },
      ]},
      { name: 'type', label: 'GST Mode', type: 'select', defaultValue: 'add', options: [
        { label: 'Add GST (Exclusive)', value: 'add' },
        { label: 'Remove GST (Inclusive)', value: 'remove' },
      ]},
    ],
    calculate: (inputs) => {
      const amt = Number(inputs.amount) || 0;
      const rate = Number(inputs.rate) || 0;
      const isAdd = inputs.type === 'add';

      let gstAmount = 0;
      let netAmount = 0;
      let totalAmount = 0;

      if (isAdd) {
        netAmount = amt;
        gstAmount = (amt * rate) / 100;
        totalAmount = amt + gstAmount;
      } else {
        totalAmount = amt;
        netAmount = amt / (1 + rate / 100);
        gstAmount = amt - netAmount;
      }

      return {
        netAmount: Math.round(netAmount * 100) / 100,
        gstAmount: Math.round(gstAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        cgst: Math.round((gstAmount / 2) * 100) / 100,
        sgst: Math.round((gstAmount / 2) * 100) / 100,
      };
    },
    chartConfig: {
      type: 'pie',
      labels: {
        netAmount: 'Net Base Amount',
        gstAmount: 'GST Tax Component',
      },
      colors: {
        netAmount: '#3B82F6',
        gstAmount: '#EF4444',
      },
    },
    aiPromptTemplate: 'Explain a GST calculation where base amount is ${netAmount}, tax slab is {rate}%, GST amount is ${gstAmount} (divided into ${cgst} CGST and ${sgst} SGST), resulting in gross ${totalAmount}. Clarify tax cascading.',
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
    id: 'age-calculator',
    name: 'Age & Birthday Calculator',
    category: 'Date & Time',
    description: 'Calculate your exact age in years, months, and days, and discover your next birthday countdown.',
    icon: 'Calendar',
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

      // Next birthday countdown
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
  {
    id: 'base-converter',
    name: 'Binary / Hex / Base Converter',
    category: 'Programming',
    description: 'Convert numbers seamlessly between Binary, Octal, Decimal, and Hexadecimal notations.',
    icon: 'Binary',
    fields: [
      { name: 'value', label: 'Input Value', type: 'text', defaultValue: '42' },
      { name: 'fromBase', label: 'From Base', type: 'select', defaultValue: 10, options: [
        { label: 'Decimal (Base 10)', value: 10 },
        { label: 'Binary (Base 2)', value: 2 },
        { label: 'Hexadecimal (Base 16)', value: 16 },
        { label: 'Octal (Base 8)', value: 8 },
      ]},
    ],
    calculate: (inputs) => {
      const val = String(inputs.value).trim();
      const from = Number(inputs.fromBase) || 10;

      try {
        const decimal = parseInt(val, from);
        if (isNaN(decimal)) {
          return { error: 'Invalid representation for base selected', decimal: 0, binary: '0', hex: '0', octal: '0' };
        }

        return {
          decimal,
          binary: decimal.toString(2),
          hex: decimal.toString(16).toUpperCase(),
          octal: decimal.toString(8),
        };
      } catch (err) {
        return { error: 'Conversion failed', decimal: 0, binary: '0', hex: '0', octal: '0' };
      }
    },
    chartConfig: {
      type: 'comparison',
      labels: {
        decimal: 'Decimal Value',
      },
    },
    aiPromptTemplate: 'Explain base conversion. The number {value} in base {fromBase} equals decimal {decimal}, binary {binary}, hex {hex}. Discuss its relevance in computing systems.',
  },
  {
    id: 'ohms-law-calculator',
    name: 'Ohm\'s Law Calculator',
    category: 'Engineering',
    description: 'Calculate voltage, current, resistance, or power using Ohm\'s Law equations.',
    icon: 'Zap',
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
      let power = 0; // Watts = V * I

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
    icon: 'Brush',
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

      // Assume 4 walls of len x h for a simple square room (or just 1 wall if we calculate simple area. Let's assume a full room: 4 walls = length * 4 * height)
      const totalWallArea = len * 4 * h;
      const doorReduction = doors * 21; // average door is 21 sq ft
      const windowReduction = windows * 15; // average window is 15 sq ft

      let paintArea = totalWallArea - doorReduction - windowReduction;
      if (paintArea < 0) paintArea = 0;

      const totalPaintArea = paintArea * coats;
      // 1 gallon covers approx 350 sq ft
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
];
