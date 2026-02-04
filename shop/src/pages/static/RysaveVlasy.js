import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';

const RysaveVlasy = () => {
  return (
    <StaticPage
      title="Ako na ryšavé vlasy"
      description="Ryšavá farba vlasov je najmenej vyskytujúca sa farba vlasov na svete. Približne len 1-2 percentá populácie je ryšavých. Je to z toho dôvodu, že nato aby ste mali ryšavé vlasy ich musíte zdediť po oboch rodičoch."
    >
      <h2 className="text-xl font-semibold mt-6 mb-2">Ako na ryšavé vlasy</h2>
      <p>
        Ryšavá farba vlasov je najmenej vyskytujúca sa farba vlasov na svete.
        Približne len 1-2 percentá populácie je ryšavých. Je to z toho dôvodu,
        že nato aby ste mali ryšavé vlasy ich musíte zdediť po oboch rodičoch.
        Možno aj preto nás táto farba vlasov fascinuje a množstvo žien sa ju
        snaží dosiahnuť. V zásade existujú dve možnosti ako to docieliť.
      </p>

      <div className="mt-4">
          <p className="font-semibold">1. Použiť chemickú farbu na vlasy - Tento spôsob je asi najjednoduchší, ale taktiež najviac poškodzuje vlasy.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>chemické farby menia štruktúru vlasov a tým ich poškodzujú</li>
            <li>často obsahujú peroxid a amoniak</li>
            <li>ničia vlasový pigment</li>
            <li>chemické farbenie má často za následok padanie vlasov, ich lámanie a vysušovanie</li>
          </ul>
      </div>

       <div className="mt-4">
          <p className="font-semibold">2. Použiť 100% prírodnú hennu na vlasy - Týmto spôsobom nepoškodzujete svoje vlasy, dosiahnete prirodzený odtieň a doprajete vlasom prírodnú starostlivosť.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>henna nemení štruktúru vlasov. Vlasy len obaľuje ale nepreniká do nich</li>
            <li>zabraňuje nadmernému vypadávaniu vlasov</li>
            <li>pomáha v boji proti lupinám</li>
            <li>vlasy vyživuje a dodáva im lesk</li>
            <li>henna zafarbí aj šedivé vlasy</li>
            <li>farbenie hennou je zdĺhavejšie ale výsledok stojí zato :)</li>
          </ul>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Chceli by ste sa dozvedieť ako dosiahnuť ryšavé vlasy hennou? V tom prípade je tento článok presne pre vás</h2>
      <p>
        Ihneď na začiatku je potrebné povedať, že farbenie hennou na ryšavo
        nie je pre každého. Keďže henna je 100% prírodná nevie vlasy zosvetliť.
        Takže ak máte tmavé vlasy, s hennou ryšavú nikdy nedosiahnete.
      </p>
      <p className="mt-2">
        Farbenie hennou nie je vôbec také komplikované ako si mnohé z nás
        myslia. Na začiatok odporúčame použiť hennu značky <Link to="/category/voono" className="text-tany-green hover:underline">Voono</Link>. Veľmi dobre sa nanáša a medzi zákazníčkami je obľúbená.
      </p>

      <div className="my-8 max-w-md mx-auto">
        <div className="border rounded p-4">
          <Link to="/product/henna-voono-copper" className="font-bold text-lg hover:text-tany-green block mb-2">Henna prírodná farba na vlasy Voono Copper (Medená) 100g</Link>
          <p className="font-bold text-tany-green">Cena 10,76 €</p>
          <Link to="/product/henna-voono-copper" className="inline-block mt-2 text-white bg-tany-green px-4 py-2 rounded">Detail</Link>
        </div>
      </div>

       <div className="my-4">
        <Link to="/category/medene-farby" className="text-tany-green font-bold hover:underline">Zobraziť všetky medené farby na vlasy</Link>
      </div>


      <h2 className="text-xl font-semibold mt-6 mb-2">Ryšavé farby na vlasy Biokap</h2>
      <p>
        Ak sa predsa len rozhodnete farbiť si vlasy chemickou farbou,
        odporúčame vám prírodnejšie farby Biokap. Neobsahujú látky ako PPD, sú
        bez parabénov, amoniaku a bez parfémov.
        Bonusom je, že ich stačí mať pri farbení na vlasoch len 10 minút, čím
        sa znižuje možnosť alergickej reakcie.
      </p>

      <div className="my-8 max-w-md mx-auto">
        <div className="border rounded p-4">
          <Link to="/product/biokap-medeny-blond" className="font-bold text-lg hover:text-tany-green block mb-2">Nutricolor farba na vlasy - Medený blond 7.4 140ml - Biokap</Link>
          <p className="font-bold text-tany-green">Cena 12,15 €</p>
          <Link to="/product/biokap-medeny-blond" className="inline-block mt-2 text-white bg-tany-green px-4 py-2 rounded">Detail</Link>
        </div>
      </div>
    </StaticPage>
  );
};

export default RysaveVlasy;
