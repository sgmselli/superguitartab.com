import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Page } from "./components/Page";
import Landing from "./pages/Landing/Landing";
import Song from "./pages/Song/Song";
import Account from "./pages/Account/Account";
import { NotFound } from "./pages/NotFound";
import Genre from "./pages/Genre/Genre";
import Style from "./pages/Style/Style";
import Browse from "./pages/Browse/Browse";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsAndConditions } from "./pages/TermsAndConditions";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import { AuthProvider } from "./contexts/auth";

import AuthorizedRoute from "./components/ProtectedRoutes/AuthorizedRoute";
import UnauthorisedRoute from "./components/ProtectedRoutes/UnauthorizedRoute";
import { Logout } from "./pages/Auth/Logout";

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes>
            <Route path="/" element={<Page children={<Landing />} />} />
            <Route path="/browse" element={<Page children={<Browse />} />} />
            <Route path="/category/genre/:genre" element={<Page children={<Genre />} />} />
            <Route path="/category/style/:style" element={<Page children={<Style />} />} />
            <Route path="/song/:id" element={<Page children={<Song />} />} />
            <Route path="/privacy-policy" element={<Page showFaq={false} children={<PrivacyPolicy />} />} />
            <Route path="/terms-and-conditions" element={<Page showFaq={false} children={<TermsAndConditions />} />} />
            <Route path="/*" element={<Page children={<NotFound />} />} />

            {/* Must be authenticated routes */}
            <Route element={<AuthorizedRoute />}>
              <Route path="/account" element={<Page showFaq={false} children={<Account />} />} />
              <Route path="/logout" element={<Page showFaq={false} children={<Logout />} />} />
            </Route>

            {/* Must be unauthenticated routes */}
            <Route element={<UnauthorisedRoute />}>
              <Route path="/login" element={<Page showFaq={false} children={<Login />} />} />
              <Route path="/register" element={<Page showFaq={false} children={<Register />} />} />
            </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
