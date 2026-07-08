import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  LogOut,
  Package,
  LayoutDashboard,
  SlidersHorizontal,
} from "lucide-react";

import useCartStore from "../store/cartStore.js";
import { getTotalItems } from "../utils/cartCalculations.js";
import useAuthStore from "../store/authStore.js";
import api from "../services/api.js";

const DEFAULT_CATEGORIES = [
  "all",
  "electronics",
  "fashion",
  "accessories",
  "lifestyle",
];

const formatCategoryName = (category, short = false) => {
  const value = String(category || "all");

  if (value === "all") {
    return short ? "All" : "All Categories";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  const items = useCartStore((state) => state.items);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const totalItems = getTotalItems(items || []);

  const { user, isAuthenticated, logout } = useAuthStore();

  const searchParams = new URLSearchParams(location.search);

  const activeCategory = searchParams.get("category") || "all";
  const activeSearch = searchParams.get("search") || "";
  const activeSort = searchParams.get("sort") || "latest";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/products");

        const products = Array.isArray(data?.products) ? data.products : [];

        const databaseCategories = products
          .map((product) => product.category?.trim().toLowerCase())
          .filter(Boolean);

        const mergedCategories = [
          ...new Set([...DEFAULT_CATEGORIES, ...databaseCategories]),
        ];

        setCategories(mergedCategories);
      } catch (error) {
        console.log("Navbar categories error:", error.message);
        setCategories(DEFAULT_CATEGORIES);
      }
    };

    fetchCategories();
  }, []);

  const updateProductQuery = ({ category, search, sort, closeMenu = false }) => {
    const params = new URLSearchParams(location.search);

    if (category !== undefined) {
      if (category === "all") {
        params.delete("category");
      } else {
        params.set("category", category);
      }
    }

    if (search !== undefined) {
      const cleanSearch = String(search).trim();

      if (cleanSearch === "") {
        params.delete("search");
      } else {
        params.set("search", cleanSearch);
      }
    }

    if (sort !== undefined) {
      if (sort === "latest") {
        params.delete("sort");
      } else {
        params.set("sort", sort);
      }
    }

    if (closeMenu) {
      setIsMenuOpen(false);
    }

    const queryString = params.toString();

    navigate(queryString ? `/products?${queryString}` : "/products");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("search") || "";

    updateProductQuery({
      search: searchValue,
      closeMenu: true,
    });
  };

  const handleCategoryChange = (e) => {
    updateProductQuery({
      category: e.target.value,
      closeMenu: true,
    });
  };

  const handleSortChange = (e) => {
    updateProductQuery({
      sort: e.target.value,
      closeMenu: true,
    });
  };

  const handleLogout = () => {
    removeCoupon();
    logout();
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-2 text-sm font-bold transition-all duration-300 ${
      isActive
        ? "bg-black text-white shadow-md"
        : "text-gray-600 hover:bg-gray-100 hover:text-black"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
      isActive
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-black"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-gray-200 bg-white/90 shadow-xl backdrop-blur-xl"
          : "border-transparent bg-white"
      }`}
    >
      <nav className="mx-auto max-w-[1500px] px-4 xl:px-6">
        <div className="flex min-h-20 items-center justify-between gap-3">
          <Link to="/" className="group flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-lg font-extrabold text-white shadow-lg transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
              S
            </div>

            <div className="hidden md:block">
              <h1 className="text-base font-black tracking-tight text-black xl:text-lg">
                Smart Commerce
              </h1>
              <p className="-mt-1 text-[11px] font-bold text-gray-500">
                Premium Store
              </p>
            </div>
          </Link>

          <div className="hidden shrink-0 items-center rounded-full border bg-white p-1 shadow-sm lg:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>

            {isAuthenticated && (
              <NavLink to="/orders" className={navLinkClass}>
                Orders
              </NavLink>
            )}

            {isAuthenticated && user?.role === "admin" && (
              <>
              <NavLink to="/admin/orders" className={navLinkClass}>
                All orders
              </NavLink>
              <NavLink to="/admin/products" className={navLinkClass}>
              Products Admin
              </NavLink>
            </>
              
            )}
          </div>

          <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
            <form
              onSubmit={handleSearchSubmit}
              className="relative min-w-[300px] max-w-2xl flex-1"
            >
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                key={activeSearch}
                type="text"
                name="search"
                defaultValue={activeSearch}
                placeholder="Search products..."
                className="h-10 w-full rounded-full border bg-gray-50 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none transition-all duration-300 hover:border-gray-300 focus:border-black focus:bg-white"
              />
            </form>

            <div className="flex h-10 shrink-0 items-center gap-1 rounded-full border bg-gray-50 px-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />

              <select
                value={activeCategory}
                onChange={handleCategoryChange}
                className="w-24 bg-transparent text-xs font-bold text-gray-700 outline-none xl:w-28"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {formatCategoryName(category, true)}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={activeSort}
              onChange={handleSortChange}
              className="h-10 w-24 shrink-0 rounded-full border bg-gray-50 px-3 text-xs font-bold text-gray-700 outline-none transition-all duration-300 hover:border-gray-300 focus:border-black xl:w-28"
            >
              <option value="latest">Latest</option>
              <option value="priceLow">Low Price</option>
              <option value="priceHigh">High Price</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <NavLink
              to="/cart"
              className="relative flex h-10 items-center gap-2 rounded-full bg-black px-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 xl:px-4"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>

              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-black text-black">
                {totalItems}
              </span>

              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"></span>
              )}
            </NavLink>

            <div className="hidden items-center gap-2 xl:flex">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/profile"
                    className="flex h-10 max-w-32 items-center gap-2 rounded-full border px-3 text-xs font-bold text-gray-700 transition-all duration-300 hover:border-black hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 shrink-0" />
                    <span className="truncate">{user?.name || "Profile"}</span>
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-10 items-center gap-2 rounded-full border border-red-200 px-3 text-xs font-bold text-red-600 transition-all duration-300 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="rounded-full px-3 py-2 text-sm font-bold text-gray-700 transition-all duration-300 hover:bg-gray-100"
                  >
                    Login
                  </NavLink>

                  <NavLink
                    to="/register"
                    className="rounded-full bg-black px-4 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-gray-800"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-all duration-300 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="pb-4 lg:hidden">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              key={activeSearch}
              type="text"
              name="search"
              defaultValue={activeSearch}
              placeholder="Search products and press Enter..."
              className="h-12 w-full rounded-full border bg-gray-50 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none transition-all duration-300 focus:border-black focus:bg-white"
            />
          </div>
        </form>

        <div
          className={`overflow-hidden transition-all duration-500 lg:hidden ${
            isMenuOpen ? "max-h-[780px] pb-5 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="rounded-3xl border bg-white p-4 shadow-xl">
            <div className="space-y-2">
              <NavLink to="/" className={mobileNavLinkClass}>
                Home
              </NavLink>

              <NavLink to="/products" className={mobileNavLinkClass}>
                <Package className="h-4 w-4" />
                Products
              </NavLink>

              {isAuthenticated && (
                <NavLink to="/orders" className={mobileNavLinkClass}>
                  <Package className="h-4 w-4" />
                  Orders
                </NavLink>
              )}

              {isAuthenticated && user?.role === "admin" && (
                <>
                  <NavLink to="/admin/orders" className={mobileNavLinkClass}>
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Orders
                  </NavLink>

                  <NavLink to="/admin/products" className={mobileNavLinkClass}>
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Products
                  </NavLink>
                </>
              )}

              <div className="grid gap-3 pt-3 sm:grid-cols-2">
                <select
                  value={activeCategory}
                  onChange={handleCategoryChange}
                  className="h-12 rounded-2xl border bg-gray-50 px-4 text-sm font-bold text-gray-700 outline-none focus:border-black"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {formatCategoryName(category)}
                    </option>
                  ))}
                </select>

                <select
                  value={activeSort}
                  onChange={handleSortChange}
                  className="h-12 rounded-2xl border bg-gray-50 px-4 text-sm font-bold text-gray-700 outline-none focus:border-black"
                >
                  <option value="latest">Latest Products</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <div className="border-t pt-3">
                {isAuthenticated ? (
                  <>
                    <NavLink to="/profile" className={mobileNavLinkClass}>
                      <User className="h-4 w-4" />
                      {user?.name || "Profile"}
                    </NavLink>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-red-600 transition-all duration-300 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <NavLink
                      to="/login"
                      className="rounded-2xl border px-4 py-3 text-center text-sm font-bold text-gray-700 transition hover:border-black"
                    >
                      Login
                    </NavLink>

                    <NavLink
                      to="/register"
                      className="rounded-2xl bg-black px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-gray-800"
                    >
                      Register
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;