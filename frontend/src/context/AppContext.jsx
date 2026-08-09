import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  
  // Shopping Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Wishlist State
  const [wishlist, setWishlist] = useState([]);

  // Modals & Single View Detail State
  const [selectedSoftwareDetail, setSelectedSoftwareDetail] = useState(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [selectedSoftwareForQuote, setSelectedSoftwareForQuote] = useState(null);
  const [freelancerModalOpen, setFreelancerModalOpen] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState(null);
  const [articleModalPost, setArticleModalPost] = useState(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + (product.quantity || 1) } : item
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });
    showToast(`Added "${product.name || product.title}" to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from wishlist.`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Added to wishlist!`);
        return [...prev, product];
      }
    });
  };

  const openQuoteModal = (softwareItem = null) => {
    setSelectedSoftwareForQuote(softwareItem);
    setQuoteModalOpen(true);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.sale_price || item.price || item.regular_price || 0) * item.quantity,
    0
  );

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        selectedSoftwareDetail,
        setSelectedSoftwareDetail,
        selectedProductDetail,
        setSelectedProductDetail,
        quoteModalOpen,
        setQuoteModalOpen,
        selectedSoftwareForQuote,
        openQuoteModal,
        freelancerModalOpen,
        setFreelancerModalOpen,
        videoModalUrl,
        setVideoModalUrl,
        articleModalPost,
        setArticleModalPost,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
