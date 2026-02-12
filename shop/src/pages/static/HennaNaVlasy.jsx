import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';
import ProductEmbed from "../../components/ProductEmbed";

const HennaNaVlasy = () => {
  return (
    <StaticPage
      title="Najlepšia henna na vlasy"
      description="Množstvo našich zákazníčok sa na nás obracia s otázkou, ktorá henna ja tá najlepšia a na túto otázku neexistuje jednoznačná odpoveď."
    >
      <h2 className="text-xl font-semibold mt-6 mb-2">Najlepšia henna na vlasy</h2>
      <p>
        Množstvo našich zákazníčok sa na nás obracia s otázkou, ktorá henna ja
        tá najlepšia a na túto otázku neexistuje jednoznačná odpoveď, ale
        pokúsime sa vám v krátkosti zhrnúť výhody jednotlivých značiek henny,
        aby ste sa vedeli lepšie rozhodnúť.
      </p>
      <p>
        V prvom rade všetky práškové henny ktoré máme v ponuke sú 100%
        prírodné. Toto je jedna z hlavných vecí na ktoré sa pri kúpe henny
        zamerať. Pravá medená henna má jednoduché zloženie. Jediná zložka ktorú
        obsahuje je pomletý prášok listov rastliny Lawsonia Itermis.
        Preto ak nakupujete hennu prvý krát dajte si pozor na zloženie výrobku.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Prečo používať hennu?</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>regeneruje poškodené vlasy (často spôsobené chemickým farbením)</li>
        <li>zamedzuje vypadávaniu vlasov</li>
        <li>podporuje rast vlasov</li>
        <li>henna prekryje aj šedivé vlasy</li>
        <li>zafarbenie hennou pôsobí prirodzene</li>
        <li>henna účinne bojuje proti lupinám</li>
      </ul>

      <div className="my-8 space-y-6">
        <div className="border rounded p-4">
          <Link to="/kategoria/henna-na-vlasy?q=Brand-Indian+Natural+Hair+Care" className="font-bold text-lg hover:text-tany-green block">Indická henna</Link>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
             <li>najobľúbenejšia značka henny</li>
             <li>BIO pôvod surovín</li>
             <li>v ponuke taktiež výborné tuhé šampóny, vlasové vody a vosky na vlasy</li>
             <li>ekonomické 200g a 1kg balenia</li>
          </ul>
           <Link to="/kategoria/henna-na-vlasy?q=Brand-Indian+Natural+Hair+Care" className="inline-block mt-2 text-tany-green hover:underline font-bold">Prejsť na produkty Indickej Henny</Link>
        </div>

        <div className="border rounded p-4">
          <Link to="/kategoria/henna-na-vlasy?q=Brand-Voono+Henna+na+vlasy" className="font-bold text-lg hover:text-tany-green block">Voono</Link>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
             <li>Česká značka vyrábaná v Indii</li>
             <li>čoraz viac obľúbená a predávaná henna</li>
             <li>množstvo odtieňov ktoré u konkurenčných značiek nenájdete</li>
             <li>pre podporu farebných odtieňov používajú ďalšie bylinky ako napríklad ibištek, amlu a ďalšie</li>
             <li>100g a 500g balenia</li>
          </ul>
           <Link to="/kategoria/henna-na-vlasy?q=Brand-Voono+Henna+na+vlasy" className="inline-block mt-2 text-tany-green hover:underline font-bold">Prejsť na produkty Voono</Link>
        </div>

        <div className="border rounded p-4">
          <Link to="/kategoria/henna-na-vlasy?q=Brand-Henne+Color" className="font-bold text-lg hover:text-tany-green block">Henné Color</Link>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
             <li>Francúzska henna</li>
             <li>najpredávanejšia značka</li>
             <li>okrem práškových farieb majú aj krémové</li>
             <li>k dispozícií v 100g baleniach</li>
          </ul>
           <Link to="/kategoria/henna-na-vlasy?q=Brand-Henne+Color" className="inline-block mt-2 text-tany-green hover:underline font-bold">Prejsť na produkty Henné Color</Link>
        </div>

        <div className="border rounded p-4">
          <Link to="/kategoria/henna-na-vlasy?q=Brand-Five+Fives" className="font-bold text-lg hover:text-tany-green block">Five Fives (Egyptská henna)</Link>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
             <li>Egyptská henna</li>
             <li>najnovší prírastok v našej ponuke vyžiadaný zákazníkmi</li>
             <li>100g a ekonomické 200g balenia</li>
          </ul>
           <Link to="/kategoria/henna-na-vlasy?q=Brand-Five+Fives" className="inline-block mt-2 text-tany-green hover:underline font-bold">Prejsť na produkty Egyptskej Henny</Link>
        </div>

        <div className="border rounded p-4">
          <Link to="/kategoria/henna-na-vlasy?q=Vlastnosti+farby-BAQ+%252D+Body+Art+Quality" className="font-bold text-lg hover:text-tany-green block">BAQ henna Ayumi</Link>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
             <li>BAQ (body art quality) henna</li>
             <li>henna najvyššej kvality</li>
             <li>vhodná aj na tetovanie hennou</li>
             <li>väčší obsah farbiva ako pri bežnej henne</li>
             <li>100g a ekonomické 1kg balenia</li>
          </ul>
           <Link to="/kategoria/henna-na-vlasy?q=Vlastnosti+farby-BAQ+%252D+Body+Art+Quality" className="inline-block mt-2 text-tany-green hover:underline font-bold">Zobraziť BAQ Henny</Link>
        </div>
      </div>

        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProductEmbed slug="100-indicka-henna-200g-medena-kura-indian-natural-hair-care" />
            <ProductEmbed slug="henna-prirodna-farba-na-vlasy-voono-copper-medena-100g" />
            <ProductEmbed slug="henna-powder-cuivre-medena-100g-henne-color" />
            <ProductEmbed slug="baq-henna-natural-na-vlasy-aj-telo-500g-ayumi" />
        </div>

      <p>
        Aké je teda naše odporúčanie na záver? Zo skúseností vieme, že
        najlepšia henna na vlasy je relatívny pojem. Máme zákazníčky ktoré
        nedajú dopustiť na <Link to="/kategoria/henna-na-vlasy?q=Brand-Henne+Color" className="text-tany-green hover:underline">Henné color</Link>, iné zas na <Link to="/kategoria/henna-na-vlasy?q=Brand-Indian+Natural+Hair+Care" className="text-tany-green hover:underline">Indickú hennu</Link> alebo <Link to="/kategoria/henna-na-vlasy?q=Brand-Voono+Henna+na+vlasy" className="text-tany-green hover:underline">Voono</Link>. Všetky spomenuté značky su vysoko kvalitné a záleží len na
        Vás ktorá vám sadne najlepšie. Preto najlepšia vec ktorú môžete spraviť
        je nebáť sa experimentovať a skúšať :)
      </p>
      <p className="mt-4">
        Ak idete hennovať prvý krát odporúčame skúsiť Henné color. Je to rokmi
        overená kvalita a je najlacnejšia. Keď budete s hennou spokojná
        vyskúšajte ďalšie značky a sama budete vedieť najlepšie porovnať ktorá
        henna Vám sedí najviac a ktorá je ta najlepšia :)
      </p>
      <p className="mt-4">
        Budeme samozrejme radi keď sa s nami podelíte o skúsenosti.
      </p>
    </StaticPage>
  );
};

export default HennaNaVlasy;
