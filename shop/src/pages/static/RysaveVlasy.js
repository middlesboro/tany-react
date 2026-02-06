import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';
import ProductEmbed from "../../components/ProductEmbed";

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
        Takže ak máte tmavé vlasy, s hennou ryšavú nikdy nedosiahnete.  Pre približnú predstavu aký odtieň môžete dosiahnuť prikladáme nasledujúci obrázok.
      </p>

      <img src="https://ik.imagekit.io/8grotfwks/rysave-vlasy-odtiene.png?updatedAt=1770379611544"/>

      <p className="mt-2">
        Farbenie hennou nie je vôbec také komplikované ako si mnohé z nás
        myslia. Na začiatok odporúčame použiť hennu značky <Link to="/category/henna-na-vlasy?q=Brand-Voono+Henna+na+vlasy" className="text-tany-green hover:underline">Voono</Link>. Veľmi dobre sa nanáša a medzi zákazníčkami je obľúbená.
        Postup ako nato si môžete pozrieť v našom článku <Link to="/blog/059261d5-a28c-4d58-b3f6-42b83fa036ff" className="text-tany-green hover:underline">Ako farbiť vlasy hennou</Link>.
      </p>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductEmbed slug="henna-prirodna-farba-na-vlasy-voono-copper-medena-100g" />
        <ProductEmbed slug="100-indicka-henna-200g-medena-kura-indian-natural-hair-care" />
      </div>

       <div className="my-4">
        <Link to="/category/henna-na-vlasy?q=Odtien-Medena" className="text-tany-green font-bold hover:underline">Zobraziť všetky medené farby na vlasy</Link>
      </div>


      <h2 className="text-xl font-semibold mt-6 mb-2">Ryšavé farby na vlasy Biokap</h2>
      <p>
        Ak sa predsa len rozhodnete farbiť si vlasy chemickou farbou,
        odporúčame vám prírodnejšie farby Biokap. Neobsahujú látky ako PPD, sú
        bez parabénov, amoniaku a bez parfémov.
        Bonusom je, že ich stačí mať pri farbení na vlasoch len 10 minút, čím
        sa znižuje možnosť alergickej reakcie.
      </p>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductEmbed slug="nutricolor-farba-na-vlasy-medeny-blond-74-140ml-biokap" />
      </div>
    </StaticPage>
  );
};

export default RysaveVlasy;
