import React from 'react';

function Clients({ data }) {
  return (
    <section className="oferty">
    <h2>Klienci</h2>
        <div className="klienci">
          <ul className='klienci__flexbox'>
          <li><a>ID</a><a>Imię</a><a>Nazwisko</a><a>Moc PV</a><a>Moduły</a><a>Liczba</a><a>Moc ME</a><a>Model</a><a>Falownik</a><a>Konstrukcja</a><a>Cena netto</a><a>VAT</a><a>Cena brutto</a><a>Zarobek</a></li>
          {data.oferty.map((option, index) => (
              <li key={index} value={JSON.stringify(option)}>
                <a>{option.ID}</a> <a>{option.ImieKlienta}</a> <a>{option.NazwiskoKlienta}</a> <a>{option.MocPV}</a> <a>{option.Moduly}</a> <a>{option.LiczbaModulow}</a> <a>{option.PojemnoscME}</a> <a>{option.Magazyn}</a> <a>{option.Falownik}</a> <a>{option.Konstrukcja}</a> <a>{option.SumaNettoKlienta}</a> <a>{option.SumaVatKlienta}</a> <a>{option.SumaBruttoKlienta}</a> <a>{option.Zarobek}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>
  );
}

export default Clients;
