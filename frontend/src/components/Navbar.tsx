import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 bg-black text-white">
      <h1 className="text-xl font-bold">Codebrix</h1>

      <div className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/case-studies">Case Studies</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/support">Support</Link>
        <Link to="/faq">FAQ</Link>
        <a href="#pricing">Pricing</a>
      </div>
    </nav>
  );
}