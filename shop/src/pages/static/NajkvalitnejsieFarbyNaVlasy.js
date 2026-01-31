import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';

const NajkvalitnejsieFarbyNaVlasy = () => {
  return (
    <StaticPage title="Najkvalitnejšie farby na vlasy">
      <h2 className="text-xl font-semibold mt-6 mb-2">Najkvalitnejšie farby na vlasy</h2>
      <p>
        Aby sme ľuďom pomohli nájsť dokonalú farbu vlasov pre ich jedinečný tón
        pleti, zostavili sme zoznam najkvalitnejších farieb na vlasy dostupných
        v našom eshope Tany.sk.
        V ponuke máme 100% prírodné <Link to="/category/henna-na-vlasy" className="text-tany-green hover:underline">henny na vlasy</Link>, alebo farby <Link to="/category/biokap" className="text-tany-green hover:underline">Biokap</Link>,
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
        <div className="border rounded p-4">
          <Link to="/product/indicka-henna-medena" className="font-bold text-lg hover:text-tany-green block mb-2">100% Indická Henna 200g (MEDENÁ kúra)</Link>
          <p className="text-sm mb-2">Najpredávanejší produkt</p>
          <p className="font-bold text-tany-green">Cena 9,50 €</p>
          <Link to="/product/indicka-henna-medena" className="inline-block mt-2 text-white bg-tany-green px-4 py-2 rounded">Detail</Link>
        </div>
        <div className="border rounded p-4">
          <Link to="/product/henna-voono-copper" className="font-bold text-lg hover:text-tany-green block mb-2">Henna prírodná farba na vlasy Voono Copper (Medená)</Link>
          <p className="font-bold text-tany-green">Cena 10,76 €</p>
          <Link to="/product/henna-voono-copper" className="inline-block mt-2 text-white bg-tany-green px-4 py-2 rounded">Detail</Link>
        </div>
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
        <div className="border rounded p-4">
          <Link to="/product/biokap-rapid-prirodzena-hneda" className="font-bold text-lg hover:text-tany-green block mb-2">Farba na vlasy Nutricolor Delicato RAPID Prirodzená hnedá</Link>
          <p className="font-bold text-tany-green">Cena 13,27 €</p>
          <Link to="/product/biokap-rapid-prirodzena-hneda" className="inline-block mt-2 text-white bg-tany-green px-4 py-2 rounded">Detail</Link>
        </div>
         <div className="border rounded p-4">
          <Link to="/product/biokap-rapid-svedsky-blond" className="font-bold text-lg hover:text-tany-green block mb-2">Nutricolor Delicato RAPID farba na vlasy - Švédsky blond</Link>
          <p className="font-bold text-tany-green">Cena 13,27 €</p>
          <Link to="/product/biokap-rapid-svedsky-blond" className="inline-block mt-2 text-white bg-tany-green px-4 py-2 rounded">Detail</Link>
        </div>
      </div>

       <div className="my-4">
        <Link to="/category/biokap" className="text-tany-green font-bold hover:underline">Zobraziť farby Biokap</Link>
      </div>
    </StaticPage>
  );
};

export default NajkvalitnejsieFarbyNaVlasy;
