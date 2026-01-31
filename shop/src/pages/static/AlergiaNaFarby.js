import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';

const AlergiaNaFarby = () => {
  return (
    <StaticPage title="Ako predísť alergii na farbu na vlasy">
      <p>
        Zmeniť farbu vlasov je pre mnohé z nás veľké lákadlo, no predtým je
        dôležité zvážiť všetky možné dôsledky a jedným z nich je aj možnosť
        alergickej reakcie. Vo väčšine prípadov farbenie prebehne bez
        problémov, no hlavne pri chemických farbách sa nejaké reakcie nedajú
        vylúčiť.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Príznaky alergie na farby na vlasy</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>vyrážka</li>
        <li>nevoľnosť</li>
        <li>opuchnuté oči</li>
        <li>podráždenie pokožky hlavy</li>
        <li>pľuzgiere alebo šupinky</li>
        <li>pálenie pokožky</li>
        <li>pocit slabosti</li>
        <li>zvýšené vypadávanie vlasov</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Čo robiť pri príznakoch alergie</h2>
      <p>
        Ak sa u vás prejavia príznaky alergickej reakcie, je potrebné farbu čo
        najskôr vymyť (ak to je ešte možné) a vypiť jednu až päť šálok vody, aby
        sa vyplavili toxíny z tela. Samozrejme pri horších prejavoch alergie je
        nevyhnutné vyhľadať lekársku pomoc.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Za ako dlho sa alergia prejaví</h2>
      <p>
        Väčšina výrobcov odporúča spraviť test na alergickú reakciu 48 hodín
        pred farbením, takže do tejto doby sa alergia mala prejaviť, ale
        samozrejme, nedá sa vylúčiť alergia ani po tejto dobe. Je bežné, že
        alergia sa pri prvom farbení neprejavuje vôbec a vznikne až po rokoch.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Test alergie na farbu na vlasy</h2>
      <p>
        Predtým ako sa pustíte do farbenia vlasov je dôležité vykonať test na
        alergickú reakciu. Nezáleží či sa idete farbiť 100% prírodnou farbou
        ako je <Link to="/category/henna-na-vlasy" className="text-tany-green hover:underline">henna</Link>, alebo chemickou farbou. Alergickú reakciu totiž
        môžete mať na každú farbu na vlasy. Tak ako môžeme byť alergický alebo
        citlivý na mlieko, lepok atď. môžeme byť alergický aj na určité zložky
        farby. Či už prírodné, alebo nie. V ideálnom prípade si test na alergiu
        vykonajte 48 hodín pred farbením.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Návod ako spraviť test na alergiu</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>naneste trošku farby na predlaktie a nechajte pôsobiť približne 10 minút</li>
        <li>miesto kde ste farbu naniesla umyjete dobre vodou</li>
        <li>ak vás toto miesto nesvrbí, nesčervená ani nič podobné malo by to byť v poriadku</li>
        <li>miesto si priebežne kontrolujte počas 48 hodín</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Látky ktoré najčastejšie spôsobujú alergickú reakciu</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>peroxid (Používa sa na zosvetlenie vlasov a obsahujú ho skoro všetky chemické farby.)</li>
        <li>amoniak (Pomáha farbe lepšie preniknúť do vlasov. Je možné kúpiť aj farby bez amoniaku ako napríklad <Link to="/product/biokap" className="text-tany-green hover:underline">Biokap</Link>.)</li>
        <li>PPD (Najčastejší alergén. Často sa neprejaví pri prvom použití, ale zhoršuje sa to časom ak používate často chemické farby s obsahom PPD)</li>
        <li>parabény (Konzervanty bežne sú používané v kozmetike. Sú vyrábané z ropy a je lepšie sa im vyhnúť.)</li>
        <li>nikel</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Alternatíva ku klasickým chemickým farbám</h2>
      <p>
        Ak chcete používať 100% prírodné farby najlepšou možnosťou je prášková
        (alebo aj krémová) henna. Nielenže krásne farbí aj šediny, ale má
        blahodárne účinky na vlasy. Zmierňuje vypadávanie vlasov, pomáha v boji
        proti lupinám, dodáva vlasom lesk a má veľa ďalších výhod. Na druhú
        stranu s hennou nedosiahnete blond odtieň ak máte tmavé vlasy a niekedy
        je ťažšie dosiahnuť presne ten odtieň, ktorý požadujete.
      </p>
      <div className="my-4">
        <Link to="/category/henna-na-vlasy" className="text-tany-green font-bold hover:underline">Zobraziť všetky henny na vlasy</Link>
      </div>
      <p>
        Ďalšou alternatívou je používať chemické farby s čo najmenšou
        koncentráciou látok vyvolávajúcich alergickú reakciu. Jednou z takýchto
        značiek je Biokap. Neobsahujú amoniak, PPD, sú bez parfémov a testované
        na nikel (obsah niklu na minimálnej a bezpečnej úrovni - 1 ppm).
      </p>
      <div className="my-4">
        <Link to="/product/biokap" className="text-tany-green font-bold hover:underline">Zobraziť farby Biokap</Link>
      </div>
      <p>
        Poslednou alternatívou je nechať si svoju pôvodnú farbu vlasov :)
      </p>
    </StaticPage>
  );
};

export default AlergiaNaFarby;
