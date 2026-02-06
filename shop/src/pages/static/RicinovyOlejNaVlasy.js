import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';
import ProductEmbed from "../../components/ProductEmbed";

const RicinovyOlejNaVlasy = () => {
  return (
    <StaticPage
      title="Ricínový olej na vlasy - prírodný záchranca vlasov"
      description="Problémy s vlasmi poznáme skoro každý. Či už to je vypadávanie vlasov, rednutie, alebo štiepenie. Bohužiaľ našim životným štýlom, nedostatkom pohybu a nesprávnym stravovaním vlasom neposkytujeme všetky potrebné živiny na správny vývin."
    >
      <h2 className="text-xl font-semibold mt-6 mb-2">Ricínový olej na vlasy - prírodný záchranca vlasov</h2>
      <p>
        Problémy s vlasmi poznáme skoro každý. Či už to je vypadávanie vlasov,
        rednutie, alebo štiepenie. Bohužiaľ našim životným štýlom, nedostatkom
        pohybu a nesprávnym stravovaním vlasom neposkytujeme všetky potrebné
        živiny na správny vývin.
        Predtým ako skúsite drahé prípravky s často pochybným chemickým
        zložením dajte šancu ricínovému oleju, ktorý stojí pár eur a má čisto
        prírodné zloženie.
        Ricínový olej sa získava zo semien jednoročnej rastliny ricínovníka,
        rastúcej v tropických oblastiach. Má svetložltú farbu a obsahuje viac
        ako 90% kyseliny ricínovej, ktorá ma silné antibakteriálne účinky a
        preto patrí medzi obľúbené zložky kozmetických výrobkov.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Výhody ricínového oleja</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>podporuje rast vlasov a zamedzuje ich vypadávaniu a rednutiu. Olej je vhodný pre mužov aj pre ženy. Vďačí tomu vysokému obsahu kyseliny ricínovej a omega-6 mastných kyselín</li>
        <li>vyživuje pokožku hlavy</li>
        <li>pomáha rýchlo odstraňovať lupiny a suché vlasy</li>
        <li>jednoduchá aplikácia</li>
      </ul>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductEmbed slug="100-bio-ricinovy-olej-100ml-drfeelgood" />
        <ProductEmbed slug="100-ricinovy-olej-100ml-ancient-wisdom" />
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Ricínový olej na rýchlejší rast vlasov</h2>
      <p>
        Olej stačí približne 2x týždenne vmasírovať do vlasovej pokožky, vlasy
        zabaliť do uteráka, nechať pôsobiť cez noc a potom opláchnuť. Olej
        zásobuje vlasové folikuly živinami a po použití sú zdravšie, pevnejšie
        a budú rýchlejšie rásť.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Ricínový olej na lupiny</h2>
      <p>
        Ak vás trápia lupiny zmiešajte v rovnakom pomere jojobový olej a
        ricínový olej a zmes vmasírujte do vlasovej pokožky. Pretože ricínový
        olej má protizápalové účinky, pokožku hlavy zanecháva zdravú a
        prirodzene ju zvlhčuje, čím pomáha v boji proti lupinám.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Ricínový olej v kombinácií s esenciálnymi olejmi</h2>
      <p>
        Olej je vhodné kombinovať s esenciálnymi olejmi, ktoré zmes oleja
        krásne prevoňajú a ešte viac posilnia účinky. Vhodné je zmiešať
        ricínový olej s 1-2 kvapkami <Link to="/product/rozmarin-prirodny-esencialny-olej-10ml-tuli-a-tuli" className="text-tany-green hover:underline">esenciálneho oleja rozmarín</Link>, ktorý má
        taktiež priaznivé účinky na vlasy a podporuje ich rast.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Ako nanášať ricínový olej</h2>
      <p>
        Ricínový olej vždy nanášame na pokožku hlavy a nie priamo na vlasy.
      </p>
    </StaticPage>
  );
};

export default RicinovyOlejNaVlasy;
