import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';

const NajlepsiaFarbaNaVlasyBezAmoniaku = () => {
  return (
    <StaticPage
      title="Najlepšia farba na vlasy bez amoniaku"
      description="V minulosti bol amoniak bežnou súčasťou farieb na vlasy a prakticky neexistovala farba bez amoniaku. Amoniak slúži vo farbe nato, aby sa farba dobre uchytila vo vlasoch."
    >
      <h2 className="text-xl font-semibold mt-6 mb-2">Najlepšia farba na vlasy bez amoniaku</h2>
      <p>
        V minulosti bol amoniak bežnou súčasťou farieb na vlasy a prakticky
        neexistovala farba bez amoniaku. Amoniak slúži vo farbe nato, aby sa
        farba dobre uchytila vo vlasoch. Problém s amoniakom je ten, že pri
        procese uchytávania farby vo vlasoch, vlasy zároveň aj poškodzuje.
        Vlasy strácajú hebkosť, lesk, spôsobuje lámanie vlasov a podobne. A v
        prvom rade spôsobuje alergické reakcie.
        Čím dlhšie budete používať farbu s amoniakom, tým máte väčšiu šancu, že
        sa u vás prejaví nejaký príznak alergickej reakcie. Alergické reakcie
        ale nespôsobuje len amoniak. Pozor si musíte dať aj na zložky farieb
        ako PPD, rôzne chemické parfúmy alebo nikel.
        Ak chcete farbiť vlasy naozaj prírodne, bez obavy z poškodenia vlasov
        odporúčame <Link to="/category/henna-na-vlasy" className="text-tany-green hover:underline">hennu na vlasy</Link>. Dôvod je jednoduchý. Čistý prášok henny
        neobsahuje nič iné, len pomleté listy rastliny Lawsonia inermis.
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
        <div className="border rounded p-4">
          <Link to="/product/indicka-henna-medena" className="font-bold text-lg hover:text-tany-green block mb-2">100% Indická Henna 200g (MEDENÁ kúra)</Link>
          <p className="text-sm mb-2">Najpredávanejší produkt</p>
          <p className="font-bold text-tany-green">Cena 9,50 €</p>
          <Link to="/product/indicka-henna-medena" className="inline-block mt-2 text-white bg-tany-green px-4 py-2 rounded">Detail</Link>
        </div>
        <div className="border rounded p-4">
          <Link to="/product/henna-voono-dark-brown" className="font-bold text-lg hover:text-tany-green block mb-2">Henna prírodná farba na vlasy Voono Dark Brown</Link>
          <p className="font-bold text-tany-green">Cena 10,76 €</p>
          <Link to="/product/henna-voono-dark-brown" className="inline-block mt-2 text-white bg-tany-green px-4 py-2 rounded">Detail</Link>
        </div>
      </div>

      <div className="my-4">
        <Link to="/category/henna-na-vlasy" className="text-tany-green font-bold hover:underline">Zobraziť všetky henny na vlasy</Link>
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

export default NajlepsiaFarbaNaVlasyBezAmoniaku;
