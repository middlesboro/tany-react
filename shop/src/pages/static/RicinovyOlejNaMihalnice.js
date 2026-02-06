import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';
import ProductEmbed from "../../components/ProductEmbed";

const RicinovyOlejNaMihalnice = () => {
  return (
    <StaticPage
      title="Ricínový olej na mihalnice"
      description="Ricínový olej sa získava zo semien jednoročnej rastliny ricínovníka, rastúcej v tropických oblastiach. Má svetložltú farbu a obsahuje viac ako 90% kyseliny ricínovej, ktorá ma silné antibakteriálne účinky."
    >
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

      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProductEmbed slug="100-bio-ricinovy-olej-100ml-drfeelgood" />
        <ProductEmbed slug="100-ricinovy-olej-100ml-ancient-wisdom" />
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
