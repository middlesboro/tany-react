import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PublicLayout from './components/PublicLayout';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import AuthenticationSuccess from './pages/AuthenticationSuccess';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import GlobalPaymentsCallback from './pages/GlobalPaymentsCallback';
import BesteronCallback from './pages/BesteronCallback';
import CategoryProducts from './pages/CategoryProducts';
import BlogDetail from './pages/BlogDetail';
import Account from './pages/Account';
import PublicPage from './pages/PublicPage';
import PacketaPage from './pages/PacketaPage';
import Brands from './pages/Brands';
import BrandReviews from './pages/BrandReviews';
import MagicLinkPage from './pages/MagicLinkPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import AlergiaNaFarby from './pages/static/AlergiaNaFarby';
import NajlepsiaFarbaNaVlasyBezAmoniaku from './pages/static/NajlepsiaFarbaNaVlasyBezAmoniaku';
import BezfarebnaHenna from './pages/static/BezfarebnaHenna';
import NajkvalitnejsieFarbyNaVlasy from './pages/static/NajkvalitnejsieFarbyNaVlasy';
import HennaNaVlasy from './pages/static/HennaNaVlasy';
import NajsetrnejsiaFarbaNaVlasy from './pages/static/NajsetrnejsiaFarbaNaVlasy';
import HennaNaObocie from './pages/static/HennaNaObocie';
import PrirodneFarbyNaVlasy from './pages/static/PrirodneFarbyNaVlasy';
import RicinovyOlejNaMihalnice from './pages/static/RicinovyOlejNaMihalnice';
import RicinovyOlejNaVlasy from './pages/static/RicinovyOlejNaVlasy';
import RysaveVlasy from './pages/static/RysaveVlasy';
import { CartProvider } from './context/CartContext';
import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { ModalProvider } from './context/ModalContext';
import ScrollToTop from './components/ScrollToTop';
import LoginModal from './components/LoginModal';
import MessageModal from './components/MessageModal';

function App() {
  return (
    <CartProvider>
      <BreadcrumbProvider>
        <ModalProvider>
          <Router>
            <ScrollToTop />
            <LoginModal />
            <MessageModal />
            <Routes>
              <Route path="/authentication/success" element={<AuthenticationSuccess />} />
              <Route path="/magic-link" element={<MagicLinkPage />} />
              <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<Checkout />} />
                <Route path="/order/confirmation/:id" element={<OrderConfirmation />} />
                <Route path="/global-payments-callback" element={<GlobalPaymentsCallback />} />
                <Route path="/besteron-callback" element={<BesteronCallback />} />
                <Route path="/category/:slug" element={<CategoryProducts />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                <Route path="/login" element={<Login isAdmin={false} />} />
                <Route path="/account" element={<Navigate to="/account/personal-data" replace />} />
                <Route path="/account/:tab" element={<Account />} />
                <Route path="/account/orders/:orderId" element={<Account />} />
                <Route path="/packeta" element={<PacketaPage />} />
                <Route path="/ponukane-znacky" element={<Brands />} />
                <Route path="/biokap-recenzie" element={
                  <BrandReviews
                    brandId="799185bf-064a-4c63-b02b-f0336b99ace4"
                    title="Biokap farby na vlasy - recenzie a skúsenosti"
                    description={`Biokap ponúka 30 ročné skúsenosti vo výskume a vo výrobe rastlinných extraktov. Produkty sú bez obsahu najčastejších alergénov. Produkty v línii Rapid neobsahujú:
 - PEG,
 - Silikóny
 - Parabény
 - SLS
 - Amoniak
 - Rezorcinol
 - PPD (Paraphenylenediamine)
Produkty sú dermatologicky testované a testované tiež na nikel.
Produkty Biokap Rapid sú určené pre ženy s veľmi citlivou a problematickou pokožkou hlavy, alebo s veľmi zničenými a oslabenými vlasmi. Aj preto stačí ponechať farbiacu zmes na vlasoch len 10 minút, čím sa minimalizuje vznik alergickej reakcie.`}
                  />
                } />
                <Route path="/farbynavlasy-recenzie" element={
                  <BrandReviews
                    brandId="799185bf-064a-4c63-b02b-f0336b99ace4, 9aa7a9b2-fc66-4497-9240-cfbaa798a51d, 30413dd6-f49c-4352-8d16-147ea0ea02ac, c57c3b9e-198f-4bee-9759-425a45a1354d, 4dc0f101-ac8e-41e3-9a2e-3949af7e0723, 6a7f1896-5eab-4fd7-a10d-012edaf58f73, 04c1f441-2ffa-4b40-97e5-6ae5580e77cb" // TODO: Replace with correct UUID for Farby na vlasy
                    title="Farby na vlasy - recenzie a skúsenosti"
                    description={`Pripravili sme si pre Vás zoznam recenzií najobľúbenejších farieb na vlasy ktoré máme od našich zákazníkov. Ak ste používali zatiaľ len chemické farby odporúčamé vyskúšať hennu.
Narozdiel od chemických farieb neničí vaše vlasy. Naopak ich regeneruje, posilňuje a zanecháva ich vláčne, lesklé a pevné. Pre ulahčenie prechodu odporúčame vyskúšať krémové henny na vlasy, ktoré sa nanášajú úplne rovnako ako klasické chemické farby.`}
                  />
                } />
                <Route path="/feelgood-recenzie" element={
                  <BrandReviews
                    brandId="8b666a0c-e8b4-4d13-863f-c3d16872c127"
                    title="Dr.Feelgood kozmetika recenzie a skúsenosti"
                    description={`Slovenská značka prírodnej kozmetiky Dr.Feelgood prináša už roky na náš trh kvalitné rastlinné oleje, tuhé šampóny, éterické oleje a najnovšie aj prírodné deodoranty, alebo obľúbené kakaové a bambucké maslo.
Používajú výhradne prírodné zložky v čo najčistejšej a najvyššej kvalite s ohľadom na primerané ceny.`}
                  />
                } />
                <Route path="/henna-na-vlasy-recenzie" element={
                  <BrandReviews
                    brandId="9aa7a9b2-fc66-4497-9240-cfbaa798a51d, 30413dd6-f49c-4352-8d16-147ea0ea02ac, c57c3b9e-198f-4bee-9759-425a45a1354d, 4dc0f101-ac8e-41e3-9a2e-3949af7e0723, 6a7f1896-5eab-4fd7-a10d-012edaf58f73, 04c1f441-2ffa-4b40-97e5-6ae5580e77cb"
                    title="Henna na vlasy recenzie a skúsenosti"
                    description={`Henna je prírodná farba na vlasy, ktorá narozdiel od chemických farieb neničí vlasy. Naopak ich regeneruje, vyživuje a zlepšuje celkovú kvalitu vlasov.
Pripravili sme si pre Vás zoznam recenzií ktoré máme od našich zákazníkov.`}
                  />
                } />
                <Route path="/henne-color-recenzie" element={
                  <BrandReviews
                    brandId="9aa7a9b2-fc66-4497-9240-cfbaa798a51d"
                    title="Henné Color recenzie a skúsenosti"
                    description={`Henné Color je francúzska značka, ktorá už viac ako 25 rokov vyrába prírodné farby na vlasy. Práškové farby Henné Color sú 100% prírodné a neobsahujú amoniak ani žiadne chemické látky.
Ako jedna z mála značiek Henné Color vyrába taktiež krémové farby na vlasy, ktoré sú ideálne ak sa s Hennou ešte len zoznamujute.
Farby na vlasy sú vhodné pre všetky typy vlasov. Vlasy narozdiel od chemických farieb neničia, ale naopak ich regenerujú a posilujú.`}
                  />
                } />
                <Route path="/voono-recenzie" element={
                  <BrandReviews
                    brandId="30413dd6-f49c-4352-8d16-147ea0ea02ac"
                    title="Voono recenzie a skúsenosti"
                    description={`Značka Voono patrí k nováčikom na našom trhu, no za krátky čas si stihli urobiť množstvo fanúšikov. Kladú dôraz na najvyššiu kvalitu, pôvod surovín a striktne odmietajú testovanie na zvieratách.
Farby na vlasy Voono sú 100% prírodné, neobsahujú amoniak, peroxid ani žiadne iné chemické látky. Oproti konkurencii sa odlišujú používaním viacerých byliniek ako napríklad Bahmu, Shikakai alebo Amla, ktoré v kombinácií s Hennou pomáhajú dosiahnuť ešte lepší farebný výsledok.`}
                  />
                } />
                <Route path="/alergia-na-farby" element={<AlergiaNaFarby />} />
                <Route path="/najlepsia-farba-na-vlasy-bez-amoniaku" element={<NajlepsiaFarbaNaVlasyBezAmoniaku />} />
                <Route path="/bezfarebna-henna" element={<BezfarebnaHenna />} />
                <Route path="/najkvalitnejsie-farby-na-vlasy" element={<NajkvalitnejsieFarbyNaVlasy />} />
                <Route path="/henna-na-vlasy" element={<HennaNaVlasy />} />
                <Route path="/najsetrnejsia-farba-na-vlasy" element={<NajsetrnejsiaFarbaNaVlasy />} />
                <Route path="/henna-na-obocie" element={<HennaNaObocie />} />
                <Route path="/prirodne-farby-na-vlasy" element={<PrirodneFarbyNaVlasy />} />
                <Route path="/ricinovy-olej-na-mihalnice" element={<RicinovyOlejNaMihalnice />} />
                <Route path="/ricinovy-olej-na-vlasy" element={<RicinovyOlejNaVlasy />} />
                <Route path="/rysave-vlasy" element={<RysaveVlasy />} />
                <Route path="/:slug" element={<PublicPage />} />
              </Route>
            </Routes>
          </Router>
        </ModalProvider>
      </BreadcrumbProvider>
    </CartProvider>
  );
}

export default App;
