/**
 * BusinessContext.jsx — Milestone 1 Refactor + Aura Sync Centralization
 *
 * AURA SYNC ARCHITECTURE (Post-Audit Fix):
 * ─────────────────────────────────────────
 * Single source of truth for ALL theme application.
 * One useEffect watches activeBranch and handles:
 *   1. document.body.classList  (CSS cascade via body.theme-* classes)
 *   2. document.documentElement CSS variables (instant color updates)
 *   3. localStorage persistence (survives page refresh)
 *
 * No other component should touch body.classList or CSS variables
 * for theming purposes. Components only call toggleBranch().
 */

import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import plazaData from "../data/plaza.json";
import stopoverData from "../data/stopover.json";

export const BusinessContext = createContext();

// ─────────────────────────────────────────────────────────────────────────────
// AURA CONFIG — Single definition of all branch theme values.
// Update colors here only; the useEffect below applies them everywhere.
// ─────────────────────────────────────────────────────────────────────────────
const AURA_CONFIG = {
  plaza: {
    bodyClass:       "theme-plaza",
    primaryColor:    "#0a0a0a",
    secondaryColor:  "#d4af37",   // Gold
  },
  stopover: {
    bodyClass:       "theme-stopover",
    primaryColor:    "#001f3f",   // Deep Navy
    secondaryColor:  "#0074d9",   // Blue
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENCE KEY — used for localStorage read/write.
// ─────────────────────────────────────────────────────────────────────────────
const BRANCH_STORAGE_KEY = "activeBranch";

/**
 * Reads the last-saved branch from localStorage.
 * Falls back to 'plaza' if nothing is stored or the value is invalid.
 */
function getInitialBranch() {
  const stored = localStorage.getItem(BRANCH_STORAGE_KEY);
  return stored === "plaza" || stored === "stopover" ? stored : "plaza";
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
export const BusinessProvider = ({ children }) => {

  // Initialize from localStorage so the theme is correct on first render/refresh.
  const [activeBranch, setActiveBranch] = useState(getInitialBranch);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paymentError, setPaymentError] = useState(null);

  // ───────────────────────────────────────────────────────────────────────────
  // AURA SYNC — THE ONE PLACE WHERE THEME IS APPLIED TO THE DOM.
  //
  // Runs on mount (applying the persisted or default theme immediately)
  // and every time activeBranch changes (applying the new theme instantly).
  //
  // Responsibilities:
  //   • Swap body class (enables CSS rules like body.theme-stopover .x { })
  //   • Set --primary-color and --secondary-color on :root
  //   • Persist the chosen branch to localStorage
  // ───────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const config = AURA_CONFIG[activeBranch];
    if (!config) return;

    // 1. Body class — remove all known theme classes, add the current one.
    const allBodyClasses = Object.values(AURA_CONFIG).map((c) => c.bodyClass);
    document.body.classList.remove(...allBodyClasses);
    document.body.classList.add(config.bodyClass);

    // 2. CSS variables on :root for instant color cascading.
    const root = document.documentElement;
    root.style.setProperty("--primary-color",   config.primaryColor);
    root.style.setProperty("--secondary-color", config.secondaryColor);

    // 3. Persist to localStorage so refresh restores the correct theme.
    localStorage.setItem(BRANCH_STORAGE_KEY, activeBranch);

    // 4. Development log — remove or guard with import.meta.env.DEV in production.
    if (import.meta.env.DEV) {
      console.log(
        `[AuraSync] Branch: ${activeBranch} | ` +
        `Primary: ${config.primaryColor} | ` +
        `Secondary: ${config.secondaryColor}`
      );
    }
  }, [activeBranch]);

  // ───────────────────────────────────────────────────────────────────────────
  // BRANCH MANAGEMENT
  // ───────────────────────────────────────────────────────────────────────────
  const toggleBranch = useCallback((branch) => {
    if (branch === "plaza" || branch === "stopover") {
      setActiveBranch(branch);
      setPaymentStatus("idle");
      setPaymentError(null);
      setToast((prev) => ({ ...prev, visible: false }));
    } else {
      console.warn(`[BusinessContext] Invalid branch: "${branch}". Use 'plaza' or 'stopover'.`);
    }
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // TOAST NOTIFICATION SYSTEM
  // ───────────────────────────────────────────────────────────────────────────
  const showNotification = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
  }, []);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(
        () => setToast((prev) => ({ ...prev, visible: false })),
        3000
      );
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // ───────────────────────────────────────────────────────────────────────────
  // DATA ACCESS
  // ───────────────────────────────────────────────────────────────────────────
  const getActiveBranchData = useCallback(() => {
    return activeBranch === "plaza" ? plazaData : stopoverData;
  }, [activeBranch]);

  // ───────────────────────────────────────────────────────────────────────────
  // THEMING & STYLING
  // Note: colors here should stay in sync with AURA_CONFIG above.
  // ───────────────────────────────────────────────────────────────────────────
  const getActiveBranchTheme = useCallback(() => {
    if (activeBranch === "plaza") {
      return {
        name:       "Penuel Plaza",
        type:       "hotel",
        primary:    AURA_CONFIG.plaza.primaryColor,
        secondary:  AURA_CONFIG.plaza.secondaryColor,
        accent:     "#E8DCC4",
        dark:       "#2C2416",
        success:    "#2D5016",
        warning:    "#C9302C",
        light:      "#F5F5DC",
        fontFamily: "'Playfair Display', serif",
      };
    }
    return {
      name:       "Penuel Stopover",
      type:       "service-hub",
      primary:    AURA_CONFIG.stopover.primaryColor,
      secondary:  AURA_CONFIG.stopover.secondaryColor,
      accent:     "#34495E",
      dark:       "#1A1A1A",
      success:    "#27AE60",
      warning:    "#E74C3C",
      light:      "#ECF0F1",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    };
  }, [activeBranch]);

  // ───────────────────────────────────────────────────────────────────────────
  // BRANCH INFO
  // ───────────────────────────────────────────────────────────────────────────
  const getBranchInfo = useCallback(() => {
    const data  = getActiveBranchData();
    const theme = getActiveBranchTheme();
    return {
      branch:   data.branch   || "Unknown Branch",
      type:     data.type     || "unknown",
      location: data.location || "Unknown Location",
      currency: data.currency || "KES",
      theme,
    };
  }, [activeBranch, getActiveBranchData, getActiveBranchTheme]);

  // ───────────────────────────────────────────────────────────────────────────
  // PAYMENT PROCESSING (Milestone 2 placeholder)
  // ───────────────────────────────────────────────────────────────────────────
  const processPayment = useCallback(
    async (paymentData) => {
      const {
        amount      = 0,
        currency    = "KES",
        phone       = "",
        description = "Penuel Empire Payment",
        orderId     = "",
        gateway     = "mpesa",
      } = paymentData;

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
        showNotification(`💳 Processing ${gateway.toUpperCase()} payment...`, "info");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        // NOTE (Milestone 2): Never log real keys — remove this block when live.
        if (import.meta.env.DEV) {
          console.warn("[BusinessContext] M-Pesa integration not yet active.");
        }

        showNotification("⏳ Payment processing (Milestone 2 pending)", "info");
        setPaymentStatus("idle");

        return {
          success:       false,
          status:        "pending",
          message:       "M-Pesa integration pending Milestone 2.",
          transactionId: orderId,
          amount,
          currency,
          phone,
          gateway,
          timestamp:     new Date().toISOString(),
        };
      } catch (error) {
        const msg = error.message || "Payment processing failed";
        setPaymentError(msg);
        setPaymentStatus("failed");
        showNotification(`❌ ${msg}`, "error");
        return { success: false, error: msg };
      }
    },
    [activeBranch, showNotification]
  );

  // ───────────────────────────────────────────────────────────────────────────
  // CONTEXT VALUE
  // ───────────────────────────────────────────────────────────────────────────
  const contextValue = useMemo(
    () => ({
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
      processPayment,
      // Raw data
      plazaData,
      stopoverData,
    }),
    [
      toast, showNotification,
      activeBranch, toggleBranch,
      getActiveBranchData, getActiveBranchTheme, getBranchInfo,
      paymentStatus, paymentError, processPayment,
    ]
  );

  return (
    <BusinessContext.Provider value={contextValue}>
      {children}
    </BusinessContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

export const useBusinessContext = () => {
  const context = React.useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusinessContext must be used within a BusinessProvider.");
  }
  return context;
};

export const useNotification = () => {
  const { toast, showNotification } = useBusinessContext();
  return { toast, showNotification };
};

export const useBranchState = () => {
  const { activeBranch, toggleBranch } = useBusinessContext();
  return { activeBranch, toggleBranch };
};

export const useTheme = () => {
  const { getActiveBranchTheme, getBranchInfo } = useBusinessContext();
  return { theme: getActiveBranchTheme(), branchInfo: getBranchInfo() };
};

export const withBusinessContext = (WrappedComponent) => (props) => {
  const businessContext = useBusinessContext();
  return <WrappedComponent {...props} businessContext={businessContext} />;
};

export default BusinessProvider;