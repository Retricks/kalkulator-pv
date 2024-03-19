import React from 'react';

function Calculator({
  data,
  selectedOptions,
  handleOptionChange,
  isPermissionAccess
}) {
  return (
    <div className="calculator__frames">
    <h1 className="title">Wybierz zestaw:</h1>
        <div className="full-element">
                <div className="element">
                    <h2 className="element__title">Moduły:</h2>
                    <select className="select" value={selectedOptions.moduly} onChange={e => handleOptionChange('moduly', e.target.value)}>
                        <option value="">Wybierz moduł</option>
                        {data.moduly.map((option, index) => (
                        <option key={index} value={JSON.stringify(option)}>
                            {option.Model}
                        </option>
                        ))}
                    </select>
                    <div className="form__group field">
                        <input className="form__field" type="number" placeholder="Liczba modułów" name="liczbaModulow" id="liczbaModulow" value={selectedOptions.liczbaModulow} onChange={e => handleOptionChange('liczbaModulow', e.target.value)}/>
                        <label htmlFor="liczbaModulow" className="form__label">Liczba modułów</label>
                    </div>
                </div>
                <div className="element">
                    <h2 className="element__title">Falowniki:</h2>
                    <select className="select" value={selectedOptions.falowniki} onChange={e => handleOptionChange('falowniki', e.target.value)}>
                        <option value="">Wybierz falownik</option>
                        {data.falowniki.map((option, index) => (
                        <option key={index} value={JSON.stringify(option)}>
                            {option.Model}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="element">
                    <h2 className="element__title">Magazyny:</h2>
                    <select className="select" value={selectedOptions.magazyny} onChange={e => handleOptionChange('magazyny', e.target.value)}>
                        <option value="">Bez magazynu</option>
                        {data.magazyny.filter(magazyny => magazyny.Kompatybilnosc == selectedOptions.kompatybilnosc).map((option, index) => (
                        <option key={index} value={JSON.stringify(option)}>
                            {option.Model}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="element">
                    <h2 className="element__title">Konstrukcje:</h2>
                    <select className="select" value={selectedOptions.konstrukcje} onChange={e => handleOptionChange('konstrukcje', e.target.value)}>
                        <option value="">Wybierz konstrukcję</option>
                        {data.konstrukcje.map((option, index) => (
                        <option key={index} value={JSON.stringify(option)}>
                            {option.Producent} - {option.Rodzaj}
                        </option>
                        ))}
                    </select>
                </div>
                {isPermissionAccess ?
                <div className="element">
                    <h2 className="element__title">Koordynacja:</h2>
                    <select className="select" value={selectedOptions.koordynacja} onChange={e => handleOptionChange('koordynacja', e.target.value)}>
                        <option value="">Wybierz koordynację</option>
                        {data.koordynacja.map((option, index) => (
                        <option key={index} value={JSON.stringify(option)}>
                            {option.Firma}
                        </option>
                        ))}
                    </select>
                </div>
                :
                <></>
                }
                
                <div className="element">
                    <h2 className="element__title">Montaż:</h2>
                    <select className="select" value={selectedOptions.montaz} onChange={e => handleOptionChange('montaz', e.target.value)}>
                        <option value="">Wybierz montaż</option>
                        {data.montaz.map((option, index) => (
                        <option key={index} value={JSON.stringify(option)}>
                            {option.Firma}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="element">
                    <h2 className="element__title">Rodzaj klienta:</h2>
                    <select className="select" value={selectedOptions.rodzajKlienta} onChange={e => handleOptionChange('rodzajKlienta', e.target.value)}>
                        <option value="">Wybierz rodzaj klienta</option>
                        <option value="Klient indywidualny">Klient indywidualny</option>
                        <option value="Klient biznesowy">Klient biznesowy</option>
                    </select>
                </div>
            </div>
      </div>
  );
}

export default Calculator;
