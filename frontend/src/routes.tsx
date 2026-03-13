import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import CaseStudies from "./pages/CaseStudies";
import Blog from "./pages/Blog";
import Support from "./pages/Support";
import FAQ from "./pages/FAQ";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/support" element={<Support />} />
        <Route path="/faq" element={<FAQ />} />

      </Routes>
    </BrowserRouter>
  );
}