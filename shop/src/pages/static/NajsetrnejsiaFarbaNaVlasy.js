import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';
import ProductEmbed from "../../components/ProductEmbed";

const NajsetrnejsiaFarbaNaVlasy = () => {
  return (
    <StaticPage
      title="Najšetrnejšia farba na vlasy"
      description="Nato aby sme mohli povedať, ktorá farba na vlasy je najšetrnejšia, musí spĺňať jedno dôležité kritérium. Farba musí byť 100% prírodná."
    >
      <h2 className="text-xl font-semibold mt-6 mb-2">Najšetrnejšia farba na vlasy</h2>
      <p>
        Nato aby sme mohli povedať, ktorá farba na vlasy je najšetrnejšia, musí
        spĺňať jedno dôležité kritérium. Farba musí byť 100% prírodná. V
        obchodoch nájdeme množstvo farieb s rôznymi prívlastkami, no vždy je
        dôležité pozrieť si dôkladne zloženie farby. Ak obsahuje kopec cudzích
        názvov a chemických výrazov, tak si môžeme byť istý, že o šetrnej farbe
        nemôže byť žiadna reč.
        Naopak existuje jeden druh farby, kde môžeme s určitosťou povedať, že
        je šetrná k vlasom a to je <Link to="/kategoria/henna-na-vlasy" className="text-tany-green hover:underline">henna</Link>. Dôvod je jednoduchý. Čistý prášok
        henny neobsahuje nič iné, len pomleté listy rastliny Lawsonia inermis.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Prečo používať hennu na vlasy?</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>100% prírodná a šetrná rastlinná farba</li>
        <li>s hennou dosiahnete rôzne odtiene, nielen ryšavú farbu</li>
        <li>nepreniká do štruktúry vlasov ako to je v prípade chemických farieb, ale vlasy len obaľuje a vytvára ochrannú vrstvu</li>
        <li>vlasy vyživuje a regeneruje - vlasom dodáva lesk</li>
        <li>pomáha proti lupinám</li>
        <li>predchádza a zabraňuje nadmernému vypadávaniu vlasov</li>
        <li>vhodná aj na citlivú pokožku</li>
        <li>vhodné aj na šedivé vlasy</li>
        <li>neobsahujú amoniak, peroxid, PPD ani žiadne chemické látky</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Nevýhody henny</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>vlasy nevie zosvetliť</li>
        <li>nanášanie je pracnejšie a nie každej z nás sa pozdáva</li>
        <li>niekomu vadí vôňa henny, ale to sa dá jednoducho vyriešiť pridaním obľúbeného esenciálneho oleja do zmesi s hennou</li>
        <li>keďže sa jedná o prírodnú farbu niekedy je ťažšie dosiahnuť presne odtieň, ktorý by ste chcela a je potrebné experimentovať</li>
      </ul>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductEmbed slug="100-indicka-henna-200g-medena-kura-indian-natural-hair-care" />
        <ProductEmbed slug="henna-prirodna-farba-na-vlasy-voono-dark-brown-tmavo-hneda-100g" />
      </div>

      <div className="my-4">
        <Link to="/kategoria/henna-na-vlasy" className="text-tany-green font-bold hover:underline">Zobraziť všetky henny na vlasy</Link>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Prírodné farby na vlasy Biokap</h2>
      <p>
        Ak sa vám do farbenia hennou z akéhokoľvek dôvodu príliš nechce a
        preferujete klasické krémové farby. Odporúčam vyskúšať Talianske farby
        Biokap.
        Farby Biokap sa radia medzi permanentné farby na vlasy a sú určené pre
        ženy s veľmi citlivou a problematickou pokožkou hlavy, alebo s veľmi
        zničenými a oslabenými vlasmi. Vo verzii rapid stačí mať farbu na
        vlasoch len 10 minút, čím sa zabezpečuje minimálne riziko vzniku
        alergickej reakcie.
        Veľkou výhodou farieb Biokap je obsah prírodných zložiek a absencia
        chemických zložiek ako amoniak, PPD a ďalšie.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Výhody farby na vlasy Biokap</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>vysoký podiel prírodných zložiek</li>
        <li>bez obsahu PPD a amoniaku</li>
        <li>na zafarbenie stačí len 10 minút</li>
        <li>klinické testy na znášanlivosť farby vykonané v Taliansku (Pavia) + certifikát</li>
        <li>vhodné na citlivú pokožku</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Nevýhody farby Biokap</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>nie sú 100% prírodné a také šetrné ako henna</li>
        <li>vyššia cena</li>
      </ul>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductEmbed slug="farba-na-vlasy-nutricolor-delicato-rapid-prirodzena-hneda-40-140ml-biokap" />
        <ProductEmbed slug="nutricolor-delicato-rapid-farba-na-vlasy-svedsky-blond-71-140ml-biokap" />
      </div>

       <div className="my-4">
        <Link to="/kategoria/vsetky-produkty?q=Brand-Biosline%20-%20Biokap" className="text-tany-green font-bold hover:underline">Zobraziť farby Biokap</Link>
      </div>
    </StaticPage>
  );
};

export default NajsetrnejsiaFarbaNaVlasy;
