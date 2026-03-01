/**
 * BusinessContext.jsx — Triple-Aura Architecture
 *
 * THREE-STATE AURA SYSTEM:
 * ─────────────────────────────────────────────────────────────────────────────
 *  'empire'   → Fiery Phoenix aesthetic (default) — the parent brand
 *  'plaza'    → Midnight Aurum — luxury hotel
 *  'stopover' → Neon Depths — highway service hub
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Single source of truth. One useEffect applies all DOM changes:
 *   1. document.body.classList → 'theme-empire' | 'theme-plaza' | 'theme-stopover'
 *   2. CSS variables on :root for smooth CSS-transition-based color changes
 *   3. localStorage.setItem('penuel_branch', ...) for refresh persistence
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
// TRIPLE AURA CONFIG
// All design tokens live here. CSS + JS both derive from this single source.
// ─────────────────────────────────────────────────────────────────────────────
export const AURA_CONFIG = {
  empire: {
    bodyClass:       "theme-empire",
    primaryColor:    "#1e1e1e",          // Phoenix Editor Deep Dark
    secondaryColor:  "#ffae42",          // Bright Yellow-Orange (top of gradient)
    accentColor:     "#ff4500",          // Red-Orange (bottom of gradient)
    gradientStart:   "#ffae42",
    gradientEnd:     "#ff4500",
    textColor:       "#ffffff",
    textMuted:       "#c0a080",
    surfaceColor:    "#2a2a2a",
  },
  plaza: {
    bodyClass:       "theme-plaza",
    primaryColor:    "#1a1a1a",          // Midnight Black
    secondaryColor:  "#d4af37",          // Luxury Gold
    accentColor:     "#c9a026",          // Deep Gold
    gradientStart:   "#d4af37",
    gradientEnd:     "#c9a026",
    textColor:       "#ffffff",
    textMuted:       "#a0a0a0",
    surfaceColor:    "#222222",
  },
  stopover: {
    bodyClass:       "theme-stopover",
    primaryColor:    "#0a192f",          // Deep Industrial Navy
    secondaryColor:  "#0074d9",          // Electric Blue
    accentColor:     "#0056b3",          // Deep Blue
    gradientStart:   "#0074d9",
    gradientEnd:     "#00c6ff",
    textColor:       "#e8f4fd",
    textMuted:       "#7ab3d4",
    surfaceColor:    "#112240",
  },
};

const BRANCH_STORAGE_KEY = "penuel_branch";
const VALID_BRANCHES = ["empire", "plaza", "stopover"];

/**
 * Reads last-saved branch from localStorage.
 * Falls back to 'empire' (the parent brand) if nothing stored or invalid.
 */
function getInitialBranch() {
  const stored = localStorage.getItem(BRANCH_STORAGE_KEY);
  return VALID_BRANCHES.includes(stored) ? stored : "empire";
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
export const BusinessProvider = ({ children }) => {

  const [activeBranch, setActiveBranch] = useState(getInitialBranch);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [paymentError, setPaymentError]   = useState(null);

  // ─────────────────────────────────────────────────────────────────────────
  // AURA SYNC — THE SINGLE SOURCE OF DOM THEME APPLICATION
  //
  // Fires on mount (restoring persisted branch) and on every branch switch.
  // CSS custom properties animate via transition rules defined in App.css.
  // ─────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const config = AURA_CONFIG[activeBranch];
    if (!config) return;

    // 1. Body class — swap to the correct theme class
    const allBodyClasses = Object.values(AURA_CONFIG).map((c) => c.bodyClass);
    document.body.classList.remove(...allBodyClasses);
    document.body.classList.add(config.bodyClass);

    // 2. CSS variables — applied to :root, animated by CSS transitions
    const root = document.documentElement;
    root.style.setProperty("--primary-color",    config.primaryColor);
    root.style.setProperty("--secondary-color",  config.secondaryColor);
    root.style.setProperty("--accent-color",     config.accentColor);
    root.style.setProperty("--gradient-start",   config.gradientStart);
    root.style.setProperty("--gradient-end",     config.gradientEnd);
    root.style.setProperty("--text-color",       config.textColor);
    root.style.setProperty("--text-muted",       config.textMuted);
    root.style.setProperty("--surface-color",    config.surfaceColor);

    // 3. Persist branch selection
    localStorage.setItem(BRANCH_STORAGE_KEY, activeBranch);

    if (import.meta.env.DEV) {
      console.log(`[AuraSync] ✦ Branch: ${activeBranch} → ${config.bodyClass}`);
    }
  }, [activeBranch]);

  // ─────────────────────────────────────────────────────────────────────────
  // BRANCH MANAGEMENT
  // Now handles three valid states: 'empire', 'plaza', 'stopover'
  // ─────────────────────────────────────────────────────────────────────────
  const toggleBranch = useCallback((branch) => {
    if (VALID_BRANCHES.includes(branch)) {
      setActiveBranch(branch);
      setPaymentStatus("idle");
      setPaymentError(null);
      setToast((prev) => ({ ...prev, visible: false }));
    } else {
      console.warn(
        `[BusinessContext] Invalid branch: "${branch}". ` +
        `Use one of: ${VALID_BRANCHES.join(", ")}.`
      );
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // TOAST NOTIFICATION SYSTEM
  // ─────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  // DATA ACCESS
  // Empire state falls back to plaza data as the "parent" data set.
  // ─────────────────────────────────────────────────────────────────────────
  const getActiveBranchData = useCallback(() => {
    if (activeBranch === "stopover") return stopoverData;
    return plazaData; // empire and plaza both use plaza data
  }, [activeBranch]);

  // ─────────────────────────────────────────────────────────────────────────
  // THEMING
  // ─────────────────────────────────────────────────────────────────────────
  const getActiveBranchTheme = useCallback(() => {
    const config = AURA_CONFIG[activeBranch];
    const base = {
      empire: {
        name:       "Penuel Empire",
        type:       "holding-company",
        fontFamily: "'Georgia', serif",
      },
      plaza: {
        name:       "Penuel Plaza",
        type:       "hotel",
        fontFamily: "'Georgia', serif",
      },
      stopover: {
        name:       "Penuel Stopover",
        type:       "service-hub",
        fontFamily: "'Georgia', serif",
      },
    }[activeBranch];

    return {
      ...base,
      primary:    config.primaryColor,
      secondary:  config.secondaryColor,
      accent:     config.accentColor,
    };
  }, [activeBranch]);

  // ─────────────────────────────────────────────────────────────────────────
  // BRANCH INFO
  // ─────────────────────────────────────────────────────────────────────────
  const getBranchInfo = useCallback(() => {
    const data  = getActiveBranchData();
    const theme = getActiveBranchTheme();
    return {
      branch:   activeBranch === "empire" ? "Penuel Empire" : (data.branch || "Unknown"),
      type:     activeBranch === "empire" ? "holding-company" : (data.type || "unknown"),
      location: activeBranch === "empire" ? "East Africa" : (data.location || "Unknown"),
      currency: data.currency || "KES",
      theme,
    };
  }, [activeBranch, getActiveBranchData, getActiveBranchTheme]);

  // ─────────────────────────────────────────────────────────────────────────
  // PAYMENT PROCESSING (Milestone 2 placeholder)
  // ─────────────────────────────────────────────────────────────────────────
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
        await new Promise((r) => setTimeout(r, 2000));
        if (import.meta.env.DEV) {
          console.warn("[BusinessContext] M-Pesa integration not yet active.");
        }
        showNotification("⏳ Payment processing (Milestone 2 pending)", "info");
        setPaymentStatus("idle");
        return {
          success: false, status: "pending",
          message: "M-Pesa integration pending Milestone 2.",
          transactionId: orderId, amount, currency, phone, gateway,
          timestamp: new Date().toISOString(),
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

  // ─────────────────────────────────────────────────────────────────────────
  // CONTEXT VALUE
  // ─────────────────────────────────────────────────────────────────────────
  const contextValue = useMemo(
    () => ({
      toast, showNotification,
      activeBranch, toggleBranch,
      getActiveBranchData, getActiveBranchTheme, getBranchInfo,
      paymentStatus, paymentError, processPayment,
      plazaData, stopoverData,
      // Expose config for components that need to derive colors
      auraConfig: AURA_CONFIG,
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

export const useNotification  = () => {
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
