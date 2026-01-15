import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Search, Plus, Minus, X, Trash2, ShoppingBag, Filter, ArrowRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
}

const Store: React.FC = () => {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
      if(window.confirm("Are you sure you want to clear your cart?")) {
        setCart([]);
      }
  };

  const handleCheckout = () => {
    setShowConfetti(true);
    setTimeout(() => {
        alert("Thank you for your purchase! (This is a demo)");
        setCart([]);
        setIsCartOpen(false);
        setShowConfetti(false);
    }, 500);
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const categories = ['All', 'Food', 'Toys', 'Grooming', 'Accessories', 'Health'];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 relative">
      
      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-paws-purple to-indigo-600 text-white p-8 md:p-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Pawsitivity Store 🛍️</h1>
                <p className="text-lg md:text-xl text-indigo-100 max-w-xl">
                    Premium nutrition, durable toys, and essential care products delivered to your doorstep.
                </p>
            </div>
            <div className="hidden md:block">
                 <ShoppingBag size={120} className="text-white opacity-20 transform -rotate-12" />
            </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 sticky top-20 z-30 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur py-4 transition-all">
            
            {/* Search */}
            <div className="relative w-full md:w-96 shadow-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search for food, brand, or toys..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-none bg-white dark:bg-gray-800 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-paws-pink focus:outline-none"
                />
            </div>

            {/* Cart Trigger */}
            <button 
                onClick={() => setIsCartOpen(true)}
                className="relative bg-white dark:bg-gray-800 p-3 px-5 rounded-xl shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-paws-pink transition-all flex items-center gap-3 group w-full md:w-auto justify-center"
            >
                <div className="relative">
                    <ShoppingCart size={24} className="text-gray-700 dark:text-gray-200 group-hover:text-paws-pink transition-colors" />
                    {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-paws-pink text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                            {cartItemCount}
                        </span>
                    )}
                </div>
                <span className="font-bold text-gray-700 dark:text-white">
                    ₹{cartTotal.toLocaleString('en-IN')}
                </span>
            </button>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide mb-2">
            {categories.map((cat) => (
            <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all transform hover:scale-105
                ${selectedCategory === cat 
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}
            >
                {cat}
            </button>
            ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
             <div className="text-center py-20">
                 <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                 <h3 className="text-xl font-bold text-gray-500">No products found</h3>
                 <p className="text-gray-400">Try adjusting your search or category.</p>
             </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
                <div key={product.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                
                {/* Image Area */}
                <div className="h-52 relative bg-gray-50 dark:bg-gray-700 p-6 flex items-center justify-center overflow-hidden">
                    <img src={product.image} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-sm" />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/50 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                        {product.category}
                    </div>
                </div>

                {/* Details Area */}
                <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-xs font-bold text-paws-pink uppercase tracking-wider">{product.brand}</div>
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded text-yellow-600 dark:text-yellow-400 text-xs font-bold">
                            <Star size={10} fill="currentColor" />
                            <span>{product.rating}</span>
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 dark:text-white leading-tight mb-2 line-clamp-2 flex-1" title={product.name}>
                        {product.name}
                    </h3>
                    
                    <div className="mt-4 flex items-center justify-between">
                        <div className="font-bold text-xl text-gray-900 dark:text-white">
                            ₹{product.price.toLocaleString('en-IN')}
                        </div>
                        <button 
                            onClick={() => addToCart(product)}
                            className="bg-gray-100 dark:bg-gray-700 hover:bg-paws-pink hover:text-white dark:hover:bg-paws-pink dark:hover:text-white text-gray-900 dark:text-white p-2.5 rounded-xl transition-all shadow-sm active:scale-95"
                            title="Add to Cart"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {/* Cart Sidebar Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Sidebar */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col animate-slide-in-right">
                
                {/* Cart Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
                            Your Cart <span className="bg-paws-pink text-white text-sm px-2 py-1 rounded-full">{cartItemCount}</span>
                        </h2>
                    </div>
                    <button 
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                            <ShoppingBag size={64} className="text-gray-300" />
                            <p className="text-lg font-medium text-gray-500">Your cart is empty</p>
                            <button 
                                onClick={() => setIsCartOpen(false)}
                                className="text-paws-pink font-bold hover:underline"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center p-2 shrink-0">
                                    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm text-gray-800 dark:text-white line-clamp-2">{item.name}</h4>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.brand}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="font-bold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                                        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 px-2 py-1">
                                            <button 
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="text-gray-500 hover:text-paws-pink disabled:opacity-30"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="text-gray-500 hover:text-paws-pink"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Cart Footer */}
                {cart.length > 0 && (
                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span className="text-green-500 font-medium">Free</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-xl font-extrabold text-gray-900 dark:text-white">Total</span>
                            <span className="text-2xl font-extrabold text-paws-pink">₹{cartTotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                             <button 
                                onClick={clearCart}
                                className="col-span-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                             >
                                Clear
                             </button>
                             <button 
                                onClick={handleCheckout}
                                className="col-span-2 px-4 py-3 bg-paws-pink text-white font-bold rounded-xl hover:bg-teal-600 transition-colors shadow-lg flex items-center justify-center gap-2"
                             >
                                Checkout <ArrowRight size={20} />
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default Store;