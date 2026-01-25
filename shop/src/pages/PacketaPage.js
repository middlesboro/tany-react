import React from 'react';

const PacketaPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Čo je to Packeta?</h1>
      <p className="mb-8 text-gray-600">
        Packeta je sieť partnerských predajní a prevádzok, na ktorých si
        môžete prevziať tovar zakúpený v našom eshope.
      </p>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ako to funguje?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="flex flex-col items-center text-center">
          <img
            src="https://files.packeta.com/web/images/page/pickup_step1.png"
            alt="Krok 1"
            className="h-32 mb-4 object-contain"
          />
          <p className="text-gray-600">
            Pri objednávke v našom eshope si vyberte pobočku, ktorú máte
            najbližšie.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <img
            src="https://files.packeta.com/web/images/page/pickup_step2.png"
            alt="Krok 2"
            className="h-32 mb-4 object-contain"
          />
          <p className="text-gray-600">
            Hneď ako odovzdáme tovar k preprave, tak vám Packeta pošle email
            s trasovacím číslom. Cestu vašej zásielky tak môžete sledovať
            online.
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <img
            src="https://files.packeta.com/web/images/page/pickup_step3.png"
            alt="Krok 3"
            className="h-32 mb-4 object-contain"
          />
          <p className="text-gray-600">
            Po doručení zásielky na vami zvolené výdajné miesto vám pošle
            Packeta SMS a e-mail s heslom. Od tejto chvíle si ju môžete
            kedykoľvek do 7 dní vyzdvihnúť. Dobu na vyzdvihnutie je možné
            predĺžiť až na 21 dní.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Zoznam výdajných miest</h2>
      <p className="mb-4 text-gray-600">
        Nižšie nájdete prehľad všetkých pobočiek s aktuálnymi informáciami. Po
        kliknutí na názov pobočky sa zobrazia detailnejšie informácie o pobočke.
        Tú, na ktorej si tovar preberiete si zvolíte až na stránke s
        objednávkou. Prehľad nižšie má informačný charakter.
      </p>

      <div className="w-full h-[600px] border border-gray-200">
        <iframe
          src="https://widget.packeta.com/#/?&gpsOff=1&apiKey=96cee6278e535aa5&country=sk&carriers=packeta&language=sk&primaryButtonColor=white"
          width="100%"
          height="100%"
          title="Packeta widget"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default PacketaPage;
