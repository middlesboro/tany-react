import React from 'react';
import { Link } from 'react-router-dom';
import StaticPage from '../../components/StaticPage';

const PrirodneFarbyNaVlasy = () => {
  return (
    <StaticPage
      title="Prírodné farby na vlasy"
      description="Čoraz viac žien sa snaží používať a vyhľadávať, čo najprírodnejšie farby na vlasy, pretože si uvedomujú, ako veľmi škodia vlasom pri používaní klasických chemických farieb."
    >
      <h2 className="text-xl font-semibold mt-6 mb-2">Prírodné farby na vlasy</h2>
      <p>
        Čoraz viac žien sa snaží používať a vyhľadávať, čo najprírodnejšie
        farby na vlasy, pretože si uvedomujú, ako veľmi škodia vlasom pri
        používaní klasických chemických farieb. Nehovoriac o tom, že už nejedna
        z nás mala nepríjemnú alergickú reakciu na farbu.
        V našom článku sa vám pokúsime, čo najprehľadnejšie predstaviť naše
        prírodné alternatívy k chemickým farbám.
      </p>
      <p className="mt-2">
        Postupne si predstavíme hennu na vlasy, permanentnú farbu Indus Valley
        a farby na vlasy Biokap.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Henna na vlasy</h2>
      <p>
        Keď sa povie prírodná farba na vlasy, tak prvé, čo si predstavím je
        jednoznačne henna. Snáď neexistuje prírodnejšia farba ako henna,
        pretože sa jedná o 100% jemne pomletý prášok rastliny s krásnym
        latinským názvom lawsonia inermis.
      </p>

      <h3 className="text-lg font-medium mt-4 mb-2">Výhody henny</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>100% prírodná rastlinná farba</li>
        <li>nepreniká do štruktúry vlasov, ale vlasy len obaľuje a vytvára ochrannú vrstvu</li>
        <li>vlasy regeneruje a dodávajú im lesk</li>
        <li>pomáha proti lupinám</li>
        <li>vhodná aj na citlivú pokožku</li>
        <li>vhodné aj na šedivé vlasy</li>
        <li>neobsahujú amoniak, peroxid, PPD ani žiadne chemické látky</li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">Nevýhody henny</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>vlasy nevie zosvetliť</li>
        <li>nanášanie je pracnejšie a nie každej z nás sa pozdáva</li>
        <li>niekomu vadí vôňa henny, ale to sa dá jednoducho vyriešiť pridaním obľúbeného esenciálneho oleja do zmesi s hennou</li>
        <li>keďže sa jedná o prírodnú farbu niekedy je ťažšie dosiahnuť presne odtieň, ktorý by ste chcela a je potrebné experimentovať</li>
      </ul>
      <div className="my-4">
        <Link to="/category/henna-na-vlasy" className="text-tany-green font-bold hover:underline">Zobraziť všetky henny na vlasy</Link>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Krémové henny na vlasy</h2>
      <p>
        Rozdiel medzi klasickou a krémovou hennou je ten, že krémovú kúpite už
        namiešanú v tube podobne, ako pri klasických farbách.
        Ďalším dôležitým rozdielom je, že krémové henny zvyčajne nie sú 100%
        prírodné, ale obsahujú aj pridané chemické látky. Stále je to však
        neporovnateľne menej, ako pri klasických chemických farbách.
        V ponuke máme aj 100% prírodné krémové henny značky Logona.
      </p>

      <h3 className="text-lg font-medium mt-4 mb-2">Výhody krémovej henny</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>ľahšia aplikácia farby</li>
        <li>vhodné aj na šedivé vlasy</li>
        <li>regenerujú vlasy a dodávajú im lesk</li>
        <li>vhodné ak sa s hennou ešte len oboznamujete</li>
        <li>neobsahujú amoniak, peroxid, PPD</li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">Nevýhody krémovej henny</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>zvyčajne nie 100% prírodné zloženie</li>
        <li>vymývajú sa rýchlejšie, ako práškové henny</li>
      </ul>
      <div className="my-4">
        <Link to="/category/kremove-henny" className="text-tany-green font-bold hover:underline">Zobraziť krémové henny na vlasy</Link>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Permanentná farba na vlasy Indus Valley</h2>
      <p>
        Jedná sa o celosvetovo prvú farbu na vlasy, ktorá sa môže pýšiť PHAB
        certifikátom, ktorý garantuje, že vo farbe nie sú použité chemikálie
        ako benzén, amoniak a taktiež žiadne ťažké kovy.
        Obsahuje vysoký podiel prírodných zložiek, ako napríklad henna,
        jojobový olej, aloe vera, amla a ďalšie.
      </p>

      <h3 className="text-lg font-medium mt-4 mb-2">Výhody farby Indus Valley</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>má krémovú konzistenciu a ľahko sa nanáša</li>
        <li>veľký pomer prírodných zložiek</li>
        <li>vhodná aj na šedivé vlasy</li>
        <li>príjemná vôňa</li>
        <li>vhodná, aj na poškodené vlasy</li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">Nevýhody farby Indus Valley</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>nejedná sa o 100% prírodnú farbu</li>
        <li>obsahuje zlúčeninu peroxidu vodíka (ak ste alergická na peroxid tak táto farba pre vás nebude vhodná)</li>
      </ul>
      <div className="my-4">
        <Link to="/category/indus-valley" className="text-tany-green font-bold hover:underline">Zobraziť farby Indus Valley</Link>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Prírodné farby na vlasy Biokap</h2>
      <p>
        Farby Biokap sa radia medzi permanentné farby na vlasy a sú určené pre
        ženy s veľmi citlivou a problematickou pokožkou hlavy, alebo s veľmi
        zničenými a oslabenými vlasmi. Vo verzii rapid stačí mať farbu na
        vlasoch len 10 minút, čím sa zabezpečuje minimálne riziko vzniku
        alergickej reakcie.
        Veľkou výhodou farieb Biokap je obsah prírodných zložiek a absencia
        chemických zložiek ako amoniak, PPD a ďalšie.
      </p>

      <h3 className="text-lg font-medium mt-4 mb-2">Výhody farby na vlasy Biokap</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>vysoký podiel prírodných zložiek</li>
        <li>bez obsahu PPD a amoniaku</li>
        <li>na zafarbenie stačí len 10 minút</li>
        <li>klinické testy na znášanlivosť farby vykonané v Taliansku (Pavia) + certifikát</li>
        <li>vhodné na citlivú pokožku</li>
      </ul>

      <h3 className="text-lg font-medium mt-4 mb-2">Nevýhody farby Biokap</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>nie sú 100% prírodné</li>
        <li>vyššia cena</li>
      </ul>
      <div className="my-4">
        <Link to="/category/biokap" className="text-tany-green font-bold hover:underline">Zobraziť farby Biokap</Link>
      </div>
    </StaticPage>
  );
};

export default PrirodneFarbyNaVlasy;
