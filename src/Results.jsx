import React from 'react';

function Results({ message, selectedOptions, expandedResults, toggleResults, handleSaveResults, handleOptionChange, isPermissionAccess}) {
  return (
    <div className="calculator__results">
        <div className='full-element'>
        {selectedOptions.mocPV ?
        <h1 className="title">PV {selectedOptions.mocPV} kWp{selectedOptions.pojemnoscME &&
        
        <> + ME  {selectedOptions.pojemnoscME} kWh</>}</h1>
        :
        <h1 className="title">Kalkulator</h1>
        }
        <div className="result">
            <div className="section">
                {expandedResults ?
                <>
                <div className="section__prices">
                    
                {isPermissionAccess
                ?
                    <>
                        <h2 className="section__title">Cena bazowa netto: {selectedOptions.sumaNetto? <> {selectedOptions.sumaNetto} zł </> : ''}</h2>
                        <h2 className="section__title">VAT od ceny bazowej: {selectedOptions.sumaVat? <> {selectedOptions.sumaVat} zł </> : ''}</h2>
                        <h2 className="section__title">Cena bazowa: {selectedOptions.cenaBazowa? <> {selectedOptions.cenaBazowa} zł </> : ''}</h2>
                        <h2 className="section__title">Zarobek: {selectedOptions.zarobek? <> {selectedOptions.zarobek} zł </> : ''}</h2>
                        
                    </>
                    : <></>
                }
                    <h2 className="section__title">Suma netto: {selectedOptions.sumaNettoKlienta ? <> {selectedOptions.sumaNettoKlienta} zł </> : ''}</h2>
                    <h2 className="section__title">VAT: {selectedOptions.sumaVatKlienta? <> {selectedOptions.sumaVatKlienta} zł </> : ''}</h2>
                    <h2 className="section__title">Suma brutto: {selectedOptions.sumaBruttoKlienta? <> {selectedOptions.sumaBruttoKlienta} zł </> : ''}</h2>
                </div>
                <div className="form">
                    <div className="form__group field">
                        <input className="form__field" type="number" placeholder="Narzut" name="Narzut" id="Narzut" value={selectedOptions.narzut} onChange={e => handleOptionChange('narzut', e.target.value)} />
                        <label htmlFor="Narzut" className="form__label">Narzut</label>
                    </div>
                    <div className="form__group field">
                        <input className="form__field" type="text" placeholder="Imię" name="Imie" id="Imie" value={selectedOptions.imieKlienta} onChange={e => handleOptionChange('imieKlienta', e.target.value)}></input>
                        <label htmlFor="Imie" className="form__label">Imię klienta</label>
                    </div>
                    <div className="form__group field">
                        <input className="form__field" type="text" placeholder="Nazwisko" name="Nazwisko" id="Nazwisko" value={selectedOptions.nazwiskoKlienta} onChange={e => handleOptionChange('nazwiskoKlienta', e.target.value)}></input>
                        <label htmlFor="Nazwisko" className="form__label">Nazwisko klienta</label>
                    </div>
                    <button className="button" onClick={handleSaveResults}>Zapisz</button>
                </div>
                </>
                :
                <>
                <div className="section__prices">
                    <h2 className="section__title">Suma netto: {selectedOptions.sumaNettoKlienta ? <> {selectedOptions.sumaNettoKlienta} zł </> : ''}</h2>
                    <h2 className="section__title">VAT: {selectedOptions.sumaVatKlienta ? <> {selectedOptions.sumaVatKlienta} zł </> : ''}</h2>
                    <h2 className="section__title">Suma brutto: {selectedOptions.sumaBruttoKlienta ? <> {selectedOptions.sumaBruttoKlienta} zł </> : ''}</h2>
                </div>
                <div className="form">
                    <div className="form__group field">
                        <input className="form__field" type="text" placeholder="Imię" name="Imie" id="Imie" value={selectedOptions.imieKlienta} onChange={e => handleOptionChange('imieKlienta', e.target.value)}></input>
                        <label htmlFor="Imie" className="form__label">Imię klienta</label>
                    </div>
                    <div className="form__group field">
                        <input className="form__field" type="text" placeholder="Nazwisko" name="Nazwisko" id="Nazwisko" value={selectedOptions.nazwiskoKlienta} onChange={e => handleOptionChange('nazwiskoKlienta', e.target.value)}></input>
                        <label htmlFor="Nazwisko" className="form__label">Nazwisko klienta</label>
                    </div>
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    <button className="button" onClick={handleSaveResults}>Zapisz</button>
                </div>
                </>
                }
            </div>
        </div>
    </div>
                <button className="expand-button" onClick={toggleResults}>{expandedResults ? 'Zwiń' : 'Rozwiń'}</button>
  </div>
  );
}

export default Results;
