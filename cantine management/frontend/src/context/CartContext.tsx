import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FoodItem, Coupon } from '../data/mockData';
import { createOrder, fetchUserOrders } from '../api';
import { useAuth } from './AuthContext';
import Swal from 'sweetalert2';




export interface OrderCoupon {
  id: string;
  items: CartItem[];
  totalPrice: number;
  date: string;
  status: 'Pending' | 'Preparing' | 'Ready' | 'Completed';
  scheduled_time?: string | null;
  pickupLocation: string;
}


interface CartContextType {
  cart: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon | null) => void;
  discountAmount: number;
  finalPrice: number;
  bookedOrders: OrderCoupon[];
  bookOrder: (userId: string, scheduledTime?: string) => Promise<string | null>;

  lastOrderToken: string | null;
  setLastOrderToken: (token: string | null) => void;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [bookedOrders, setBookedOrders] = useState<OrderCoupon[]>([]);
  const [lastOrderToken, setLastOrderToken] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.id) {
      const loadOrders = async () => {
        try {
          const orders = await fetchUserOrders(parseInt(user.id) || 1);
          const mappedOrders: OrderCoupon[] = orders.map((o: any) => ({
            id: o.token || `ORD-${o.id}`,
            items: o.items,
            totalPrice: parseFloat(o.total),
            date: new Date(o.created_at).toLocaleString(),
            status: o.status,
            pickupLocation: 'Main Canteen Counter'
          }));
          setBookedOrders(mappedOrders);
        } catch (error) {
          console.error('Failed to load orders:', error);
        }
      };
      loadOrders();
    }
  }, [user]);

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    Swal.fire({
      title: 'Added to Cart!',
      text: `${item.name} has been added to your cart.`,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#fff',
      color: '#1a1a1a',
      iconColor: '#f97316'
    });
  };


  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: Coupon | null) => {
    setAppliedCoupon(coupon);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const discountAmount = appliedCoupon ? (
    appliedCoupon.discountType === 'percentage'
      ? (totalPrice * appliedCoupon.discountValue) / 100
      : appliedCoupon.discountValue
  ) : 0;

  const finalPrice = Math.max(0, totalPrice - discountAmount);

  const bookOrder = async (userId: string, scheduledTime?: string) => {
    try {
      const gTotal = finalPrice + (totalPrice * 0.05);
      const orderData = {
        user_id: userId,
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: gTotal,
        scheduled_time: scheduledTime
      };


      const result = await createOrder(orderData);
      setLastOrderToken(result.token);

      const newOrder: OrderCoupon = {
        id: result.id,
        items: [...cart],
        totalPrice: orderData.total,
        date: new Date().toLocaleString(),
        status: 'Pending',
        pickupLocation: 'Main Canteen Counter'
      };

      setBookedOrders(prev => [newOrder, ...prev]);
      clearCart();

      Swal.fire({
        title: 'Order Placed!',
        text: 'Your digital token has been generated.',
        icon: 'success',
        confirmButtonColor: '#f97316'
      });

      return result.token;
    } catch (error) {
      console.error('Failed to book order:', error);
      Swal.fire({
        title: 'Order Failed',
        text: 'Something went wrong while placing your order.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
    }
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        appliedCoupon,
        applyCoupon,
        discountAmount,
        finalPrice,
        bookedOrders,
        bookOrder,
        lastOrderToken,
        setLastOrderToken: (token: string | null) => setLastOrderToken(token)
      }}

    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
