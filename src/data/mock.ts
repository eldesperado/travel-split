export type Person = {
  id: string;
  name: string;
  avatarBg?: string;
  inExpense?: boolean;
};

export type Expense = {
  id: string;
  title: string;
  amountCents: number;
  paidBy: string;
  peopleCount: number;
  isWeighted?: boolean;
};

export type Balance = {
  personId: string;
  name: string;
  avatarBg?: string;
  cents: number;
};

export type Settlement = {
  id: string;
  from: string;
  to: string;
  cents: number;
  explanation: string;
};

export const MOCK_PEOPLE: Person[] = [
  { id: 'alex', name: 'Alex',  avatarBg: '#e1eadf', inExpense: true },
  { id: 'mina', name: 'Mina',  avatarBg: '#deebd9', inExpense: true },
  { id: 'sam',  name: 'Sam',   avatarBg: '#ede8df', inExpense: true },
  { id: 'jo',   name: 'Jo',    avatarBg: '#e8e3d8', inExpense: false },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: '1', title: 'Dinner',        amountCents: 8000,  paidBy: 'Alex', peopleCount: 4 },
  { id: '2', title: 'Boat tickets',  amountCents: 12000, paidBy: 'Sam',  peopleCount: 3, isWeighted: true },
  { id: '3', title: 'Hotel (2 nights)', amountCents: 34000, paidBy: 'Mina', peopleCount: 4 },
];

export const MOCK_BALANCES: Balance[] = [
  { personId: 'alex', name: 'Alex', avatarBg: '#e1eadf', cents:  2800 },
  { personId: 'mina', name: 'Mina', avatarBg: '#deebd9', cents: 25500 },
  { personId: 'sam',  name: 'Sam',  avatarBg: '#ede8df', cents: -16300 },
  { personId: 'jo',   name: 'Jo',   avatarBg: '#e8e3d8', cents: -12000 },
];

export const MOCK_SETTLEMENTS: Settlement[] = [
  {
    id: 's1',
    from: 'Sam',
    to: 'Mina',
    cents: 16300,
    explanation: "This clears Sam's −$163.00 balance and reduces Mina's +$255.00 to +$92.00.",
  },
  {
    id: 's2',
    from: 'Jo',
    to: 'Mina',
    cents: 9200,
    explanation: "This clears $92.00 of Jo's −$120.00 balance and brings Mina's balance to $0.00.",
  },
  {
    id: 's3',
    from: 'Jo',
    to: 'Alex',
    cents: 2800,
    explanation: "This clears Jo's remaining −$28.00 balance and brings Alex's balance to $0.00.",
  },
];

export function formatCents(cents: number): string {
  const sign = cents < 0 ? '−' : '+';
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = String(abs % 100).padStart(2, '0');
  return `${sign}$${dollars}.${remainder}`;
}

export function formatCentsAbs(cents: number): string {
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = String(abs % 100).padStart(2, '0');
  return `$${dollars}.${remainder}`;
}
