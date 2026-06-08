export interface User {
    id: string;
    email: string;
    full_name: string;
    currency: string;
}

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    category: string | null;
    merchant: string | null;
    transaction_date: string;
    payment_type: string;
    ai_categorized: string;
}

export interface Budget {
    id: string;
    category: string;
    monthly_limit: number;
    month_year: string;
    current_spending: number;
    percantage_used: number;
}

export interface AIInsight {
    id: string;
    content: string;
    insight_type: 'weekly_summary' | 'trend' | 'budget_alert';
    created_at: string;
}

export type Category =  'Food' | 'Transportation' | 'Shopping'| 'Bills' | 'Entertainment' | 'Subscription'| 'Education' | 'Other';
