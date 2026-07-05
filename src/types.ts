export interface CalculatorField {
  name: string;
  label: string;
  type: 'number' | 'select' | 'text' | 'boolean';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  options?: { label: string; value: any }[];
  placeholder?: string;
}

export interface CalculatorConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  fields: CalculatorField[];
  calculate: (inputs: Record<string, any>) => Record<string, any>;
  chartConfig?: {
    type: 'pie' | 'bar' | 'line' | 'comparison';
    labels: Record<string, string>; // Maps output keys to display labels
    colors?: Record<string, string>; // Maps output keys to colors
  };
  aiPromptTemplate?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  relatedCalculators: string[]; // Calculator IDs
}

export interface Comment {
  id: string;
  calculatorId: string;
  author: string;
  rating: number;
  content: string;
  date: string;
}

export interface SavedCalculation {
  id: string;
  userId?: string;
  calculatorId: string;
  calculatorName: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  date: string;
  explanation?: string;
}

export interface CategoryInfo {
  name: string;
  description: string;
  icon: string;
  slug: string;
}
