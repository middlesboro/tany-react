import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';
import ProductEmbed from "../../components/ProductEmbed";

const NajkvalitnejsieFarbyNaVlasy = () => {
  return (
    <StaticPage
      title="Najkvalitnejšie farby na vlasy"
      description="Aby sme ľuďom pomohli nájsť dokonalú farbu vlasov pre ich jedinečný tón pleti, zostavili sme zoznam najkvalitnejších farieb na vlasy dostupných v našom eshope Tany.sk."
    >
      <h2 className="text-xl font-semibold mt-6 mb-2">Najkvalitnejšie farby na vlasy</h2>
      <p>
        Aby sme ľuďom pomohli nájsť dokonalú farbu vlasov pre ich jedinečný tón
        pleti, zostavili sme zoznam najkvalitnejších farieb na vlasy dostupných
        v našom eshope Tany.sk.
        V ponuke máme 100% prírodné <Link to="/category/henna-na-vlasy" className="text-tany-green hover:underline">henny na vlasy</Link>, alebo farby <Link to="/category/farby-na-vlasy?q=Brand-Biosline+%252D+Biokap" className="text-tany-green hover:underline">Biokap</Link>,
        ktoré sú bez PPD, amoniaku a najčastejších alergénov.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Prečo používať hennu na vlasy?</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>100% prírodná rastlinná farba</li>
        <li>nepreniká do štruktúry vlasov, ale vlasy len obaľuje a vytvára ochrannú vrstvu</li>
        <li>vlasy regeneruje a dodávajú im lesk</li>
        <li>pomáha proti lupinám</li>
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
        <ProductEmbed slug="henna-prirodna-farba-na-vlasy-voono-copper-medena-100g" />
      </div>

      <div className="my-4">
        <Link to="/category/henna-na-vlasy" className="text-tany-green font-bold hover:underline">Zobraziť všetky henny na vlasy</Link>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Prírodné farby na vlasy Biokap</h2>
      <p>
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
        <li>nie sú 100% prírodné</li>
        <li>vyššia cena</li>
      </ul>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductEmbed slug="farba-na-vlasy-nutricolor-delicato-rapid-prirodzena-hneda-40-140ml-biokap" />
        <ProductEmbed slug="nutricolor-delicato-rapid-farba-na-vlasy-svedsky-blond-71-140ml-biokap" />
      </div>

       <div className="my-4">
        <Link to="/category/vsetky-produkty?q=Brand-Biosline%20-%20Biokap" className="text-tany-green font-bold hover:underline">Zobraziť farby Biokap</Link>
      </div>
    </StaticPage>
  );
};

export default NajkvalitnejsieFarbyNaVlasy;
