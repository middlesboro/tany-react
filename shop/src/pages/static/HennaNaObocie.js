import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';
import ProductEmbed from "../../components/ProductEmbed";

const HennaNaObocie = () => {
  return (
    <StaticPage
      title="Henna na obočie"
      description="Ak vám sa už stalo, že ste pri farbení vlasov rozmýšľala či je možné hennu použiť aj na obočie? Odpoveď znie áno! Henna vie rovnako dobre zafarbiť vlasy ako aj obočie."
    >
      <h2 className="text-xl font-semibold mt-6 mb-2">Môžem použiť hennu aj na obočie?</h2>
      <h3 className="text-lg font-medium mt-4 mb-2">Prírodné farbenie obočia hennou</h3>
      <p>
        Ak vám sa už stalo, že ste pri farbení vlasov rozmýšľala či je možné
        hennu použiť aj na obočie? Odpoveď znie áno! Henna vie rovnako dobre
        zafarbiť vlasy ako aj obočie.
        Rovnako ako pri farbení vlasov aj pri obočí platí, že prvým krokom je
        test na alergickú reakciu. Tak ako môžeme byť alergický alebo citlivý
        na mlieko, lepok atď. môžeme byť alergický aj na určité zložky farby.
        Či už prírodné, alebo nie. V ideálnom prípade si test na alergiu
        vykonajte 48 hodín pred farbením.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Návod ako spraviť test na alergiu</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>naneste trošku farby na predlaktie a nechajte pôsobiť približne 10 minút</li>
        <li>miesto kde ste farbu naniesla umyjete dobre vodou</li>
        <li>ak vás toto miesto nesvrbí, nesčervená ani nič podobné malo by to byť v poriadku</li>
        <li>miesto si priebežne kontrolujte počas 48 hodín</li>
      </ul>

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductEmbed slug="henna-prirodna-farba-na-vlasy-voono-copper-medena-100g" />
        <ProductEmbed slug="henna-eyebrows-pero-na-obocie-svetla-hneda-henna-penna" />
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Ako postupovať pri farbení</h2>
      <p>
        Na farbenie obočia odporúčame použiť značku <Link to="/category/henna-na-vlasy?q=Brand-Voono+Henna+na+vlasy" className="text-tany-green hover:underline">Voono</Link>. Nemal by byť problém
        ani s inými značkami, ale Voono vyložene píše, že ich farby sú nato
        vhodné. Pri ostatných značkách som takúto informáciu nenašla.
      </p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>pripravte si zmes s hennou podľa návodu</li>
        <li>henna na obočie sa nanáša čistú/odlíčenú pleť. Na kožu v okolí obočia naneste pleťový krém aby sa zabránilo nechcenému zafarbeniu kože</li>
        <li>zmes nanášajte smerom od koreňa nosa</li>
        <li>zmes s hennou musí mať správnu konzistenciu, tak aby nestekala do očí</li>
        <li>nechajte farbu pôsobiť cca 30-60 minút. Čím dlhšie henna pôsobí tým je výsledok intenzívnejší</li>
        <li>následne hennu zmyte vodou</li>
      </ul>

      <div className="my-4">
        <Link to="/category/henna-na-vlasy?q=Brand-Voono+Henna+na+vlasy" className="text-tany-green font-bold hover:underline">Zobraziť všetky Voono henny na obočie</Link>
      </div>
    </StaticPage>
  );
};

export default HennaNaObocie;
