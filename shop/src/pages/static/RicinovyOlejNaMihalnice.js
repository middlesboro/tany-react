import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';

const RicinovyOlejNaMihalnice = () => {
  return (
    <StaticPage title="Ricínový olej na mihalnice">
      <h2 className="text-xl font-semibold mt-6 mb-2">Ricínový olej na mihalnice</h2>
      <p>
        Ricínový olej sa získava zo semien jednoročnej rastliny ricínovníka,
        rastúcej v tropických oblastiach. Má svetložltú farbu a obsahuje viac
        ako 90% kyseliny ricínovej, ktorá ma silné antibakteriálne účinky.
        Vďaka obsahu mastných kyselín je výborný pre pleť a taktiež mihalnice a
        ich rast.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Dôležité upozornenie</h2>
      <p>
        Používajte vždy 100% prírodný ricínový olej. Skontrolujte preto pred
        kúpou zloženie výrobku, kde by malo byť uvedené len "Ricinus Communis
        Seed Oil". Tak ako u každého výrobku sa môže prejaviť alergická
        reakcia. Preto pred použitím si naneste malé množstvo oleja napríklad
        na predlaktie a nechajte pôsobiť ideálne 24 hodín. Ak sa neprejaví
        žiadna reakcia môžete ricínový olej používať.
      </p>

      <div className="my-8 max-w-md mx-auto">
        <div className="border rounded p-4">
          <Link to="/product/ricinovy-olej" className="font-bold text-lg hover:text-tany-green block mb-2">100% BIO ricínový olej 100ml - Dr.Feelgood</Link>
          <p className="font-bold text-tany-green">Cena 8,30 €</p>
          <Link to="/product/ricinovy-olej" className="inline-block mt-2 text-white bg-tany-green px-4 py-2 rounded">Detail</Link>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Ako sa používa ricínový olej na mihalnice?</h2>
      <p>
        Ideálny čas na nanesenie ricínového oleja na mihalnice je večer pred
        spaním. Mihalnice by mali byť čisté a úplne bez makeupu. Naneste trochu
        oleja na vatový tampón a potrite si ním mihalnice.
        Dajte si pozor aby sa vám olej nedostal do očí. V takomto prípade je
        potrebné si oči vypláchnuť vodou. Ráno jednoducho olej zmyte vodou.
        Dôležité je tento postup opakovať minimálne niekoľko týždňov. Zmeny
        nie sú viditeľné okamžite ale výsledok stojí zato.
      </p>
    </StaticPage>
  );
};

export default RicinovyOlejNaMihalnice;
