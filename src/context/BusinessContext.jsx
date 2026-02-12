/**
 * BusinessContext - Milestone 1 Refactor
 * Single Source of Truth for Penuel Empire Portal state management
 *
 * Manages:
 * - Branch state (plaza / stopover)
 * - Toast notifications (global state + auto-dismiss)
 * - Dynamic theming (primary, secondary, accent, dark, success, warning, light, font)
 * - Branch information (name, location, currency)
 * - Data access (rooms, experiences, retail, auto services, dining)
 * - Payment processing (placeholder for Milestone 2)
 *
 * Exports via useBusinessContext() hook:
 * - toast, showNotification
 * - activeBranch, toggleBranch
 * - getActiveBranchData, getActiveBranchTheme, getBranchInfo
 * - plazaData, stopoverData
 * - processPayment (M-Pesa integration pending)
 */

import React, { createContext, useState, useCallback, useMemo, useEffect } from "react";
import plazaData from "../data/plaza.json";
import stopoverData from "../data/stopover.json";

export const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  // ===== STATE MANAGEMENT =====

  // Branch State
  const [activeBranch, setActiveBranch] = useState("plaza");

  // Toast Notification State (NEW - Milestone 1)
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success" // success, info, error
  });

  // Payment State (Milestone 2)
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paymentError, setPaymentError] = useState(null);

  // ===== BRANCH MANAGEMENT =====

  /**
   * Toggle between 'plaza' and 'stopover' branches
   * Clears payment state and hides toast when switching
   */
  const toggleBranch = useCallback((branch) => {
    if (branch === "plaza" || branch === "stopover") {
      setActiveBranch(branch);
      // Reset payment state on branch switch
      setPaymentStatus("idle");
      setPaymentError(null);
      // Hide toast on branch switch
      setToast((prev) => ({ ...prev, visible: false }));
    } else {
      console.warn(`Invalid branch: ${branch}. Use 'plaza' or 'stopover'.`);
    }
  }, []);

  // ===== TOAST NOTIFICATION SYSTEM (NEW - Milestone 1) =====

  /**
   * Show notification toast to user
   * @param {string} message - Toast message to display
   * @param {string} type - Toast type: 'success', 'info', 'error'
   */
  const showNotification = useCallback((message, type = "success") => {
    setToast({
      visible: true,
      message,
      type
    });
  }, []);

  /**
   * Auto-dismiss toast after 3 seconds (NEW - Milestone 1)
   */
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // ===== DATA ACCESS =====

  /**
   * Get the active branch data
   * Returns the complete JSON structure for plaza or stopover
   */
  const getActiveBranchData = useCallback(() => {
    return activeBranch === "plaza" ? plazaData : stopoverData;
  }, [activeBranch]);

  // ===== THEMING & STYLING =====

  /**
   * Get the active branch theme configuration
   * Returns full palette of CSS variables for plaza or stopover
   *
   * Plaza Theme (Luxury/Safari):
   *   - Primary: #8B4513 (Saddle Brown)
   *   - Secondary: #D4AF37 (Gold)
   *   - Accent: #E8DCC4 (Cream)
   *   - Dark: #2C2416 (Dark Charcoal)
   *   - Success: #2D5016 (Forest Green)
   *   - Warning: #C9302C (Alert Red)
   *   - Light: #F5F5DC (Beige)
   *   - Font: Playfair Display (Luxury Serif)
   *
   * Stopover Theme (Professional/Service):
   *   - Primary: #1F5A96 (Professional Blue)
   *   - Secondary: #FF8C00 (Burnt Orange)
   *   - Accent: #34495E (Slate Gray)
   *   - Dark: #1A1A1A (Nearly Black)
   *   - Success: #27AE60 (Vibrant Green)
   *   - Warning: #E74C3C (Alert Red)
   *   - Light: #ECF0F1 (Light Gray)
   *   - Font: Inter (Modern Sans-serif)
   */
  const getActiveBranchTheme = useCallback(() => {
    if (activeBranch === "plaza") {
      return {
        // Branch Info
        name: "Penuel Plaza",
        type: "hotel",

        // Color Palette
        primary: "#8B4513", // Saddle brown (safari/earth tone)
        secondary: "#D4AF37", // Gold (luxury accent)
        accent: "#E8DCC4", // Cream (savanna)
        dark: "#2C2416", // Dark charcoal
        success: "#2D5016", // Forest green
        warning: "#C9302C", // Alert red
        light: "#F5F5DC", // Beige

        // Typography
        fontFamily: "'Playfair Display', serif" // Luxury serif
      };
    } else {
      // Stopover theme
      return {
        // Branch Info
        name: "Penuel Stopover",
        type: "service-hub",

        // Color Palette
        primary: "#1F5A96", // Professional blue
        secondary: "#FF8C00", // Burnt orange (energy)
        accent: "#34495E", // Slate gray (efficiency)
        dark: "#1A1A1A", // Nearly black
        success: "#27AE60", // Vibrant green
        warning: "#E74C3C", // Alert red
        light: "#ECF0F1", // Light gray

        // Typography
        fontFamily: "'Inter', 'Segoe UI', sans-serif" // Modern sans-serif
      };
    }
  }, [activeBranch]);

  // ===== BRANCH INFORMATION =====

  /**
   * Get branch-specific information from JSON data
   * Returns: branch name, type, location, currency, and theme
   * Ensures UI stays synced with data
   */
  const getBranchInfo = useCallback(() => {
    const data = getActiveBranchData();
    const theme = getActiveBranchTheme();

    return {
      branch: data.branch || "Unknown Branch",
      type: data.type || "unknown",
      location: data.location || "Unknown Location",
      currency: data.currency || "KES",
      theme: theme
    };
  }, [activeBranch, getActiveBranchData, getActiveBranchTheme]);

  // ===== PAYMENT PROCESSING (MILESTONE 2) =====

  /**
   * Process Payment - Placeholder for Milestone 2
   * Full M-Pesa, Pesapal, Stripe, IntaSend integration coming in Milestone 2
   *
   * @param {Object} paymentData - Payment details
   * @param {number} paymentData.amount - Amount in KES
   * @param {string} paymentData.currency - Currency code (default: KES)
   * @param {string} paymentData.phone - Customer phone (format: 254xxxxxxxxx)
   * @param {string} paymentData.description - Payment description/reference
   * @param {string} paymentData.orderId - Unique order/transaction ID
   * @param {string} paymentData.gateway - Payment gateway ('mpesa', 'pesapal', 'stripe', 'intasend')
   * @returns {Promise<Object>} Transaction response
   */
  const processPayment = useCallback(
    async (paymentData) => {
      const {
        amount = 0,
        currency = "KES",
        phone = "",
        description = "Penuel Empire Payment",
        orderId = "",
        gateway = "mpesa"
      } = paymentData;

      // Validate required fields
      if (!amount || amount <= 0) {
        setPaymentError("Invalid payment amount");
        setPaymentStatus("failed");
        showNotification("❌ Invalid payment amount", "error");
        return { success: false, error: "Invalid payment amount" };
      }

      if (!phone) {
        setPaymentError("Phone number is required");
        setPaymentStatus("failed");
        showNotification("❌ Phone number is required", "error");
        return { success: false, error: "Phone number is required" };
      }

      if (!orderId) {
        setPaymentError("Order ID is required");
        setPaymentStatus("failed");
        showNotification("❌ Order ID is required", "error");
        return { success: false, error: "Order ID is required" };
      }

      try {
        setPaymentStatus("processing");
        setPaymentError(null);

        // Log payment attempt
        console.log("💳 Payment Processing:", {
          amount,
          currency,
          phone,
          description,
          orderId,
          gateway,
          timestamp: new Date().toISOString(),
          branch: activeBranch
        });

        // Show processing notification (Milestone 1)
        showNotification(`💳 Processing ${gateway.toUpperCase()} payment...`, "info");

        // Placeholder: Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // M-Pesa config reference (for Milestone 2 implementation)
        const mpesaConfig = {
          consumerKey: import.meta.env.VITE_MPESA_CONSUMER_KEY || "NOT_SET",
          consumerSecret: import.meta.env.VITE_MPESA_CONSUMER_SECRET || "NOT_SET",
          shortCode: import.meta.env.VITE_MPESA_SHORTCODE || "NOT_SET",
          passkey: import.meta.env.VITE_MPESA_PASSKEY || "NOT_SET",
          callbackUrl: import.meta.env.VITE_MPESA_CALLBACK_URL || "NOT_SET"
        };

        // Placeholder response
        const placeholderResponse = {
          success: false,
          status: "pending",
          message: "M-Pesa integration in Milestone 2. Please configure VITE_MPESA_* in .env.local",
          transactionId: orderId,
          amount,
          currency,
          phone,
          gateway,
          timestamp: new Date().toISOString(),
          mpesaConfig
        };

        console.warn("⚠️ DEVELOPMENT MODE: M-Pesa integration not yet active.");
        console.log("Expected M-Pesa Config:", mpesaConfig);

        // Show pending notification (Milestone 1)
        showNotification("⏳ Payment processing (Milestone 2 pending)", "info");

        setPaymentStatus("idle");
        return placeholderResponse;
      } catch (error) {
        const errorMessage = error.message || "Payment processing failed";
        setPaymentError(errorMessage);
        setPaymentStatus("failed");
        showNotification(`❌ ${errorMessage}`, "error");
        console.error("Payment Error:", error);
        return { success: false, error: errorMessage };
      }
    },
    [activeBranch, showNotification]
  );

  // ===== CONTEXT VALUE (MEMOIZED) =====

  /**
   * Memoized context value to prevent unnecessary re-renders
   * Includes all state, functions, and data needed by child components
   */
  const contextValue = useMemo(
    () => ({
      // ===== TOAST NOTIFICATIONS (NEW - Milestone 1) =====
      toast,
      showNotification,

      // ===== BRANCH MANAGEMENT =====
      activeBranch,
      toggleBranch,

      // ===== THEMING & DATA =====
      getActiveBranchData,
      getActiveBranchTheme,
      getBranchInfo,

      // ===== PAYMENT (Milestone 2) =====
      paymentStatus,
      paymentError,
      processPayment,

      // ===== DATA EXPORTS =====
      plazaData,
      stopoverData
    }),
    [
      // Toast
      toast,
      showNotification,

      // Branch
      activeBranch,
      toggleBranch,

      // Theme & Data
      getActiveBranchData,
      getActiveBranchTheme,
      getBranchInfo,

      // Payment
      paymentStatus,
      paymentError,
      processPayment
    ]
  );

  return <BusinessContext.Provider value={contextValue}>{children}</BusinessContext.Provider>;
};

// ===== CUSTOM HOOKS & UTILITIES =====

/**
 * Custom Hook: useBusinessContext
 * Access business context in any component
 *
 * @returns {Object} BusinessContext value
 *
 * Example Usage:
 * const { activeBranch, toggleBranch, showNotification } = useBusinessContext();
 */
export const useBusinessContext = () => {
  const context = React.useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusinessContext must be used within BusinessProvider");
  }
  return context;
};

/**
 * Convenience Hook: useNotification
 * Access only the toast notification system
 *
 * Example Usage:
 * const { showNotification } = useNotification();
 * showNotification('Success!', 'success');
 */
export const useNotification = () => {
  const { toast, showNotification } = useBusinessContext();
  return { toast, showNotification };
};

/**
 * Convenience Hook: useBranchState
 * Access only branch switching functionality
 *
 * Example Usage:
 * const { activeBranch, toggleBranch } = useBranchState();
 */
export const useBranchState = () => {
  const { activeBranch, toggleBranch } = useBusinessContext();
  return { activeBranch, toggleBranch };
};

/**
 * Convenience Hook: useTheme
 * Access theming and styling information
 *
 * Example Usage:
 * const { theme, branchInfo } = useTheme();
 */
export const useTheme = () => {
  const { getActiveBranchTheme, getBranchInfo } = useBusinessContext();
  return {
    theme: getActiveBranchTheme(),
    branchInfo: getBranchInfo()
  };
};

/**
 * Convenience HOC: withBusinessContext
 * Wraps a component and injects business context as props
 *
 * Example Usage:
 * export default withBusinessContext(MyComponent);
 *
 * const MyComponent = ({ businessContext }) => {
 *   const { activeBranch, toggleBranch } = businessContext;
 * };
 */
export const withBusinessContext = (WrappedComponent) => {
  return (props) => {
    const businessContext = useBusinessContext();
    return <WrappedComponent {...props} businessContext={businessContext} />;
  };
};

export default BusinessProvider;
