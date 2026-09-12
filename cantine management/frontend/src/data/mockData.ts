export type UserRole = 'student' | 'teacher' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  studentId?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Snacks' | 'Beverages' | 'Meals' | 'Thali';
  image: string;
  rating: number;
  prepTime: string;
  isAvailable: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed';
  date: string;
  paymentMethod: string;
  isPriority?: boolean;
  scheduledTime?: string;
}

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Thali', icon: '🍱' },
  { id: '2', name: 'Snacks', icon: '🍿' },
  { id: '3', name: 'Beverages', icon: '🥤' },
  { id: '4', name: 'Meals', icon: '🍽️' },
];

export const DAILY_THALI_MENU: Record<string, string[]> = {
  'Monday': ['Paneer Butter Masala', 'Dal Tadka', 'Jeera Rice', '2 Roti', 'Gulab Jamun'],
  'Tuesday': ['Aloo Gobi', 'Mix Dal', 'Steamed Rice', '2 Roti', 'Boondi Raita'],
  'Wednesday': ['Veg Kolhapuri', 'Dal Fry', 'Veg Pulao', '2 Roti', 'Kheer'],
  'Thursday': ['Baingan Bharta', 'Dal Makhani', 'Peas Pulao', '2 Roti', 'Salad'],
  'Friday': ['Chole Masala', 'Dal Tadka', 'Jeera Rice', '2 Roti', 'Pickle'],
  'Saturday': ['Special Veg Handi', 'Dal Fry', 'Steamed Rice', '2 Roti', 'Sweet'],
  'Sunday': ['Chef Special Thali', 'Dal Makhani', 'Veg Biryani', '2 Roti', 'Ice Cream'],
};

export const MESS_PACKAGES = [
  {
    id: 'pkg-1',
    name: 'Standard Yearly Mess',
    price: 35000,
    duration: '1 Year',
    description: 'Includes Lunch and Dinner for the entire academic year.',
    features: ['Priority Pickup', 'Daily Thali included', 'Special Sunday Meals', 'Complimentary Drink once a week']
  },
  {
    id: 'pkg-2',
    name: 'Premium Yearly Mess',
    price: 45000,
    duration: '1 Year',
    description: 'Includes Breakfast, Lunch, and Dinner for the entire academic year.',
    features: ['Unlimited Tea/Coffee', 'Dessert with every meal', 'Home-style cooking', 'Guest meal passes (5/year)']
  }
];

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
}

export const MOCK_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'FIRST50',
    description: '50% OFF on your first order',
    discountType: 'percentage',
    discountValue: 50,
    minOrderValue: 100,
    expiryDate: '2026-12-31'
  },
  {
    id: 'c2',
    code: 'SNACKTIME',
    description: 'Flat ₹30 OFF on snacks',
    discountType: 'fixed',
    discountValue: 30,
    minOrderValue: 150,
    expiryDate: '2026-06-30'
  },
  {
    id: 'c3',
    code: 'CAMPUSLOVE',
    description: '10% OFF on all Thalis',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 200,
    expiryDate: '2026-09-30'
  }
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'thali-1',
    name: 'Executive Veg Thali',
    description: 'A complete balanced meal with seasonal vegetables, dal, rice, and roti.',
    price: 120,
    category: 'Thali',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prepTime: '15 min',
    isAvailable: true,
  },
  {
    id: 'thali-2',
    name: 'Paneer Special Thali',
    description: 'Rich paneer curry served with dal, flavored rice, and butter roti.',
    price: 150,
    category: 'Thali',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    prepTime: '15 min',
    isAvailable: true,
  },
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with fresh lettuce, tomato, and our secret sauce.',
    price: 120,
    category: 'Meals',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    prepTime: '15 min',
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Crispy Fries',
    description: 'Golden brown potato fries seasoned with sea salt.',
    price: 60,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    rating: 4.2,
    prepTime: '10 min',
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Iced Coffee',
    description: 'Chilled espresso with milk and a hint of vanilla.',
    price: 80,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    prepTime: '5 min',
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Veggie Pizza',
    description: 'Thin crust pizza topped with bell peppers, olives, and mushrooms.',
    price: 250,
    category: 'Meals',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    prepTime: '20 min',
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Chicken Nuggets',
    description: 'Bite-sized pieces of breaded and fried chicken.',
    price: 150,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    prepTime: '12 min',
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Fresh Orange Juice',
    description: '100% pure squeezed oranges with no added sugar.',
    price: 70,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    prepTime: '5 min',
    isAvailable: true,
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    userId: 's1',
    userName: 'Rahul Sharma',
    userRole: 'student',
    items: [
      { ...FOOD_ITEMS[0], quantity: 1 },
      { ...FOOD_ITEMS[1], quantity: 2 },
    ],
    total: 240,
    status: 'Completed',
    date: '2024-03-10 14:30',
    paymentMethod: 'UPI',
  },
  {
    id: 'ORD-002',
    userId: 't1',
    userName: 'Prof. Verma',
    userRole: 'teacher',
    items: [
      { ...FOOD_ITEMS[2], quantity: 2 },
    ],
    total: 160,
    status: 'Preparing',
    date: '2024-03-12 10:15',
    paymentMethod: 'Card',
    isPriority: true,
  },
];
