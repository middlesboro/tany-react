import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';

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
        <div className="border rounded p-4">
          <Link to="/product/henna-voono-copper" className="font-bold text-lg hover:text-tany-green block mb-2">Henna prírodná farba na vlasy Voono Copper (Medená)</Link>
          <p className="text-sm mb-2">Najpredávanejší produkt</p>
          <p className="font-bold text-tany-green">Cena 10,76 €</p>
          <Link to="/product/henna-voono-copper" className="inline-block mt-2 text-white bg-tany-green px-4 py-2 rounded">Detail</Link>
        </div>
        <div className="border rounded p-4">
          <Link to="/product/henna-eyebrows-svetla-hneda" className="font-bold text-lg hover:text-tany-green block mb-2">Henna Eyebrows pero na obočie Svetlá hnedá</Link>
          <p className="font-bold text-tany-green">Cena 15,17 €</p>
          <Link to="/product/henna-eyebrows-svetla-hneda" className="inline-block mt-2 text-white bg-tany-green px-4 py-2 rounded">Detail</Link>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Ako postupovať pri farbení</h2>
      <p>
        Na farbenie obočia odporúčame použiť značku <Link to="/category/voono" className="text-tany-green hover:underline">Voono</Link>. Nemal by byť problém
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
        <Link to="/category/voono" className="text-tany-green font-bold hover:underline">Zobraziť všetky Voono henny na obočie</Link>
      </div>
    </StaticPage>
  );
};

export default HennaNaObocie;
