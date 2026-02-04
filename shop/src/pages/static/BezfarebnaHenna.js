import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';

const BezfarebnaHenna = () => {
  return (
    <StaticPage
      title="Bezfarebná henna na vlasy"
      description="Keď sa povie henna, väčšina z nás si ihneď predstaví farbu na vlasy. Zvyčajne je dobre známe aj to, že farbenie hennou má množstvo zdravotných výhod pre naše vlasy."
    >
      <h2 className="text-xl font-semibold mt-6 mb-2">Bezfarebná henna na vlasy</h2>
      <p>
        Keď sa povie henna, väčšina z nás si ihneď predstaví farbu na vlasy.
        Zvyčajne je dobre známe aj to, že farbenie hennou má množstvo
        zdravotných výhod pre naše vlasy, no podľa mňa je na henne najlepšie
        to, že všetky tieto výhody môžete získať bez toho aby ste zmenili farbu
        vlasov.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Pre koho je bezfarebná henna určená?</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>pre tých čo sú spokojní so svojou farbou vlasov, ale radi by vlasom dopriali špeciálnu starostlivosť</li>
        <li>pre tých ktorí by chceli vlasy zregenerovať, spevniť, predchádzať tvorbe lupín</li>
        <li>chceli by si vyskúšať aké to je farbiť vlasy hennou bez obáv z farebného výsledku</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Čo je to vlastne tá bezfarebná henna?</h2>
      <p>
        Na začiatku je potrebné povedať, že bezfarebná henna je trochu nepresný
        názov. Výraz bezfarebná henna je zľudovený a bežne sa používa, aj keď v
        skutočnosti nejde o rastlinu henna (Lawsonia inermis), pretože čistá
        henna farbí len do medena.
        V tomto prípade sa jedná o rastlinu Cassia italica. Preto ak nájdete v
        názve produktu spojenie "bezfarebná henna", "cassia" alebo "neutre"
        jedná sa o to isté. Bezfarebná henna, alebo cassia má množstvo
        priaznivých účinkov na vlasy a v Indii a východných krajinách sa
        používa už po stáročia.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Aké sú účinky bezfarebnej henny na vlasy?</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>posilňuje jemné, riedke a oslabené vlasy</li>
        <li>zabraňuje tvorbe lupín a prílišnému masteniu vlasov</li>
        <li>zabraňuje lámaniu a štiepeniu vlasov</li>
        <li>podporuje rast vlasov</li>
        <li>spomaľuje a v niektorých prípadoch úplne zastavuje vypadávanie vlasov</li>
        <li>chráni vlasy pred predčasným šedivením vlasov</li>
        <li>zjemní vlasy a dodá im lesk</li>
        <li>má priaznivé účinky na pokožku hlavy a vytvára na nich ochrannú vrstvu</li>
      </ul>

      <div className="my-8 space-y-6">
        <div className="border rounded p-4">
          <Link to="/product/henne-color-bezfarebna" className="font-bold text-lg hover:text-tany-green block">Bezfarebná henna Henné Color</Link>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
             <li>Francúzska bezfarebná henna Henné Color</li>
             <li>najpredávanejší produkt</li>
             <li>v ponuke aj bylinková vitamínová henna</li>
             <li>100g balenia</li>
          </ul>
           <Link to="/product/henne-color-bezfarebna" className="inline-block mt-2 text-tany-green hover:underline font-bold">Zobraziť detail</Link>
        </div>

        <div className="border rounded p-4">
          <Link to="/product/indicka-bezfarebna-henna" className="font-bold text-lg hover:text-tany-green block">Indická bezfarebná henna</Link>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
             <li>Indická bezfarebná henna</li>
             <li>produkty v BIO kvalite</li>
             <li>k dispozícií v 200g a 1kg baleniach</li>
          </ul>
           <Link to="/product/indicka-bezfarebna-henna" className="inline-block mt-2 text-tany-green hover:underline font-bold">Zobraziť detail</Link>
        </div>

        <div className="border rounded p-4">
          <Link to="/product/henne-color-bylinkova" className="font-bold text-lg hover:text-tany-green block">Henné color bylinková henna</Link>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
             <li>bezfarebná henna s bylinkami (chininovník, cassia, rozmarín, dúška tymianová a iné)</li>
             <li>prírodná regeneračná kúra na vlasy</li>
             <li>100g balenia</li>
          </ul>
           <Link to="/product/henne-color-bylinkova" className="inline-block mt-2 text-tany-green hover:underline font-bold">Zobraziť detail</Link>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Pre ktorú bezfarebnú hennu sa rozhodnúť?</h2>
      <p>
        Všetky henny ktoré máme v ponuke sú kvalitné a overené, ale chápeme že
        vybrať si medzi nimi môže byť niekedy problém. Ak idete skúšať prvý
        krát bezfarebnú hennu odporúčame siahnuť po <Link to="/category/henne-color" className="text-tany-green hover:underline">Henné color</Link> (overená
        kvalita, dobrá cena), alebo skúsiť <Link to="/category/indicka-henna" className="text-tany-green hover:underline">Indickú hennu</Link> (vhodná ak máte
        dlhšie vlasy - 200g balenie, BIO produkt).
      </p>
      <p className="mt-4">
        Budeme samozrejme radi keď sa s nami podelíte o skúsenosti.
      </p>
    </StaticPage>
  );
};

export default BezfarebnaHenna;
