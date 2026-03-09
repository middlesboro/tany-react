import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AuthenticationSuccess from './pages/AuthenticationSuccess';
import MagicLinkPage from './pages/MagicLinkPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import AdminLayout from './components/AdminLayout';
import Products from './pages/Products';
import ProductEdit from './pages/ProductEdit';
import ProductImport from './pages/ProductImport';
import Categories from './pages/Categories';
import CategoryEdit from './pages/CategoryEdit';
import Customers from './pages/Customers';
import CustomerEdit from './pages/CustomerEdit';
import CustomerMessages from './pages/CustomerMessages';
import Carts from './pages/Carts';
import CartDetail from './pages/CartDetail';
import Orders from './pages/Orders';
import OrderEdit from './pages/OrderEdit';
import Brands from './pages/Brands';
import BrandEdit from './pages/BrandEdit';
import Blogs from './pages/Blogs';
import BlogEdit from './pages/BlogEdit';
import Pages from './pages/Pages';
import PageEdit from './pages/PageEdit';
import Suppliers from './pages/Suppliers';
import SupplierEdit from './pages/SupplierEdit';
import SupplierInvoices from './pages/SupplierInvoices';
import SupplierInvoiceEdit from './pages/SupplierInvoiceEdit';
import FilterParameters from './pages/FilterParameters';
import FilterParameterEdit from './pages/FilterParameterEdit';
import FilterParameterValues from './pages/FilterParameterValues';
import FilterParameterValueEdit from './pages/FilterParameterValueEdit';
import Carriers from './pages/Carriers';
import CarrierEdit from './pages/CarrierEdit';
import Payments from './pages/Payments';
import PaymentEdit from './pages/PaymentEdit';
import ShopSettings from './pages/ShopSettings';
import HomepageGrids from './pages/HomepageGrids';
import HomepageGridEdit from './pages/HomepageGridEdit';
import ProductLabels from './pages/ProductLabels';
import ProductLabelEdit from './pages/ProductLabelEdit';
import CartDiscounts from './pages/CartDiscounts';
import CartDiscountEdit from './pages/CartDiscountEdit';
import Wishlists from './pages/Wishlists';
import IskladInventoryDifferences from './pages/IskladInventoryDifferences';
import CustomerEmails from './pages/CustomerEmails';
import CustomerEmailEdit from './pages/CustomerEmailEdit';
import EmailCampaigns from './pages/EmailCampaigns';
import EmailCampaignEdit from './pages/EmailCampaignEdit';
import EmailTemplates from './pages/EmailTemplates';
import EmailTemplateEdit from './pages/EmailTemplateEdit';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const path = window.location.pathname;

  if (path.startsWith('/magic-link')) {
    return (
      <Router>
        <Routes>
          <Route path="/magic-link" element={<MagicLinkPage />} />
        </Routes>
      </Router>
    );
  }

  if (path.startsWith('/oauth/callback')) {
    return (
        <Router>
          <Routes>
            <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
          </Routes>
        </Router>
    );
  }

  if (path.startsWith('/authentication/success')) {
    return (
        <Router>
          <Routes>
            <Route path="/authentication/success" element={<AuthenticationSuccess />} />
          </Routes>
        </Router>
    );
  }

  return (
      <BreadcrumbProvider>
        <Router basename="/admin">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Navigate to="/shop-settings" replace />} />
            <Route path="/login" element={<Login isAdmin={true} />} />

            <Route element={<AdminLayout />}>
              <Route path="shop-settings" element={<ShopSettings />} />
              <Route path="homepage-grids" element={<HomepageGrids />} />
              <Route path="homepage-grids/new" element={<HomepageGridEdit />} />
              <Route path="homepage-grids/:id" element={<HomepageGridEdit />} />
              <Route path="products" element={<Products />} />
              <Route path="products/new" element={<ProductEdit />} />
              <Route path="products/import" element={<ProductImport />} />
              <Route path="products/:id" element={<ProductEdit />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/new" element={<CategoryEdit />} />
              <Route path="categories/:id" element={<CategoryEdit />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/new" element={<CustomerEdit />} />
              <Route path="customers/:id" element={<CustomerEdit />} />
              <Route path="customer-messages" element={<CustomerMessages />} />
              <Route path="customer-emails" element={<CustomerEmails />} />
              <Route path="customer-emails/new" element={<CustomerEmailEdit />} />
              <Route path="customer-emails/:id" element={<CustomerEmailEdit />} />
              <Route path="email-campaigns" element={<EmailCampaigns />} />
              <Route path="email-campaigns/new" element={<EmailCampaignEdit />} />
              <Route path="email-campaigns/:id" element={<EmailCampaignEdit />} />
              <Route path="email-templates" element={<EmailTemplates />} />
              <Route path="email-templates/new" element={<EmailTemplateEdit />} />
              <Route path="email-templates/:id" element={<EmailTemplateEdit />} />
              <Route path="brands" element={<Brands />} />
              <Route path="brands/new" element={<BrandEdit />} />
              <Route path="brands/:id" element={<BrandEdit />} />
              <Route path="pages" element={<Pages />} />
              <Route path="pages/new" element={<PageEdit />} />
              <Route path="pages/:id" element={<PageEdit />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="blogs/new" element={<BlogEdit />} />
              <Route path="blogs/:id" element={<BlogEdit />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="suppliers/new" element={<SupplierEdit />} />
              <Route path="suppliers/:id" element={<SupplierEdit />} />
              <Route path="supplier-invoices" element={<SupplierInvoices />} />
              <Route path="supplier-invoices/new" element={<SupplierInvoiceEdit />} />
              <Route path="supplier-invoices/:id" element={<SupplierInvoiceEdit />} />
              <Route path="product-labels" element={<ProductLabels />} />
              <Route path="product-labels/new" element={<ProductLabelEdit />} />
              <Route path="product-labels/:id" element={<ProductLabelEdit />} />
              <Route path="cart-discounts" element={<CartDiscounts />} />
              <Route path="cart-discounts/new" element={<CartDiscountEdit />} />
              <Route path="cart-discounts/:id" element={<CartDiscountEdit />} />
              <Route path="wishlists" element={<Wishlists />} />
              <Route path="filter-parameters" element={<FilterParameters />} />
              <Route path="filter-parameters/new" element={<FilterParameterEdit />} />
              <Route path="filter-parameters/:id" element={<FilterParameterEdit />} />
              <Route path="filter-parameter-values" element={<FilterParameterValues />} />
              <Route path="filter-parameter-values/new" element={<FilterParameterValueEdit />} />
              <Route path="filter-parameter-values/:id" element={<FilterParameterValueEdit />} />
              <Route path="carriers" element={<Carriers />} />
              <Route path="carriers/new" element={<CarrierEdit />} />
              <Route path="carriers/:id" element={<CarrierEdit />} />
              <Route path="payments" element={<Payments />} />
              <Route path="payments/new" element={<PaymentEdit />} />
              <Route path="payments/:id" element={<PaymentEdit />} />
              <Route path="carts" element={<Carts />} />
              <Route path="carts/:id" element={<CartDetail />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/new" element={<OrderEdit />} />
              <Route path="orders/:id" element={<OrderEdit />} />
              <Route path="isklad/inventory-differences" element={<IskladInventoryDifferences />} />
            </Route>
          </Routes>
        </Router>
      </BreadcrumbProvider>
  );
}

export default App;
