import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BagProvider } from "./contexts/BagContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import BagDrawer from "./components/BagDrawer";
import SnitchNav from "./components/SnitchNav";
import YweeLoader from "./components/YweeLoader";
import { CustomCursor } from "./components/system/CustomCursor";
import { SmoothScroll } from "./components/system/SmoothScroll";
import { PageTransitions } from "./components/system/PageTransitions";
import { WelcomePopup } from "./components/WelcomePopup";
import { ExitIntent } from "./components/ExitIntent";

// Main pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Lookbook from "./pages/Lookbook";
import Journal, { JournalArticle } from "./pages/Journal";
import Atelier from "./pages/Atelier";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import AuthPage from "./pages/Auth";
import Wishlist from "./pages/Wishlist";
import OrderTracking from "./pages/OrderTracking";
import Loyalty from "./pages/Loyalty";
import PressKit from "./pages/PressKit";

// Support pages
import {
  Care, Mending, Shipping, Sizing,
  Stockists, Press, Privacy, Terms, Cookies, Contact
} from "./pages/SupportPages";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/shop/:family" component={Shop} />
      <Route path="/product/:slug" component={Product} />
      <Route path="/lookbook" component={Lookbook} />
      <Route path="/journal" component={Journal} />
      <Route path="/journal/:slug" component={JournalArticle} />
      <Route path="/atelier" component={Atelier} />
      <Route path="/account" component={Account} />
      <Route path="/login" component={AuthPage} />
      <Route path="/register" component={AuthPage} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/track" component={OrderTracking} />
      <Route path="/loyalty" component={Loyalty} />
      <Route path="/press-kit" component={PressKit} />
      <Route path="/care" component={Care} />
      <Route path="/mending" component={Mending} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/sizing" component={Sizing} />
      <Route path="/stockists" component={Stockists} />
      <Route path="/press" component={Press} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/cookies" component={Cookies} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CurrencyProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <BagProvider>
                <TooltipProvider>
                  <Toaster position="bottom-center" />
                  <CustomCursor />
                  <SmoothScroll>
                    <PageTransitions>
                      <ScrollToTop />
                      {!loaderDone && <YweeLoader onDone={() => setLoaderDone(true)} />}
                      <div
                        style={{
                          visibility: loaderDone ? "visible" : "hidden",
                          opacity: loaderDone ? 1 : 0,
                          transition: "opacity 0.4s ease 0.1s",
                        }}
                      >
                        <Nav />
                        <BagDrawer />
                        <Router />
                        <Footer />
                        <SnitchNav />
                        <WelcomePopup />
                        <ExitIntent />
                      </div>
                    </PageTransitions>
                  </SmoothScroll>
                </TooltipProvider>
              </BagProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
