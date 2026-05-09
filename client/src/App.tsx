import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { BagProvider } from "./contexts/BagContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import BagDrawer from "./components/BagDrawer";
import SnitchNav from "./components/SnitchNav";
import YweeLoader from "./components/YweeLoader";

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

// Support pages
import {
  Care, Mending, Shipping, Sizing,
  Stockists, Press, Privacy, Terms, Cookies, Contact
} from "./pages/SupportPages";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/shop/:category" component={Shop} />
      <Route path="/product/:slug" component={Product} />
      <Route path="/lookbook" component={Lookbook} />
      <Route path="/journal" component={Journal} />
      <Route path="/journal/:slug" component={JournalArticle} />
      <Route path="/atelier" component={Atelier} />
      <Route path="/account" component={Account} />
      <Route path="/login" component={AuthPage} />
      <Route path="/register" component={AuthPage} />
      <Route path="/checkout" component={Checkout} />
      {/* Support pages */}
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
        <BagProvider>
          <TooltipProvider>
            <Toaster />
            {/* Premium brand loader — shown until fonts + assets are ready */}
            {!loaderDone && <YweeLoader onDone={() => setLoaderDone(true)} />}
            {/* Main app — rendered underneath loader so assets start loading immediately */}
            <div style={{ visibility: loaderDone ? "visible" : "hidden", opacity: loaderDone ? 1 : 0, transition: "opacity 0.4s ease 0.1s" }}>
              <Nav />
              <BagDrawer />
              <Router />
              <Footer />
              {/* Mobile snitch-style bottom nav */}
              <SnitchNav />
            </div>
          </TooltipProvider>
        </BagProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
