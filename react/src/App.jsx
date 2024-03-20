import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import stylów CSS
import './reset.css';
import Calculator from './Calculator';
import Results from './Results';
import Clients from './Clients';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LogoutButton from './LogoutButton';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isPermissionAccess, setIsPermissionAccess] = useState(false)
  const [isOpenNav, setIsOpenNav] = useState(false)
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [data, setData] = useState({
    moduly: [],
    falowniki: [],
    magazyny: [],
    konstrukcje: [],
    koordynacja: [],
    montaz: [],
    oferty: []
  });
  
  useEffect(() => {
    // Sprawdź stan sesji po załadowaniu komponentu
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const { isLoggedIn, username, isPermissionAccess } = JSON.parse(storedUser);
          setIsLoggedIn(isLoggedIn);
          setUsername(username);
          setIsPermissionAccess(isPermissionAccess);
        }
      } catch (error) {
        console.error('Błąd sprawdzania sesji:', error);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (formData) => {
    try {
      const response = await axios.post('https://kalkulator-pv-server.onrender.com/api/login', formData);
      const { isLoggedIn, username, isPermissionAccess } = response.data;
      setIsLoggedIn(isLoggedIn);
      setUsername(username);
      setIsPermissionAccess(isPermissionAccess);
      // Zapisz informacje o zalogowanym użytkowniku w pamięci lokalnej
      localStorage.setItem('user', JSON.stringify({ isLoggedIn, username, isPermissionAccess }));
    } catch (error) {
      console.error('Błąd logowania:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://kalkulator-pv-server.onrender.com/api/logout');
      setIsLoggedIn(false);
      setUsername('');
      setIsPermissionAccess('');
      // Usuń informacje o zalogowanym użytkowniku z pamięci lokalnej
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Błąd wylogowania:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://kalkulator-pv-server.onrender.com/api/data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  const handleSaveResults = async () => {
    try {
      const response = await axios.post('https://kalkulator-pv-server.onrender.com/api/saveResults', selectedOptions);
      setMessage(`Dodano klienta ${response.data.imieKlienta} ${response.data.nazwiskoKlienta}`)
      // Możesz dodać obsługę sukcesu, np. wyświetlenie komunikatu o sukcesie
    } catch (error) {
      console.error('Error saving results:', error);
      // Możesz dodać obsługę błędu, np. wyświetlenie komunikatu o błędzie
      return;
    }
  };

  const [selectedOptions, setSelectedOptions] = useState({
    powiadomienie: '',
    moduly: '',
    liczbaModulow: '',
    falowniki: '',
    magazyny: '',
    konstrukcje: '',
    koordynacja: '{"ID":1,"Firma":"Artur","Cena":"500.00"}',
    montaz: '',
    rodzajKlienta: '',
    narzut: '10000',
    mocPV: '',
    sumaNetto: '',
    sumaVat: '',
    sumaBrutto: '',
    cenaBazowa: '',
    sumaNettoKlienta: '',
    sumaVatKlienta: '',
    sumaBruttoKlienta: '',
    zarobek: '',
    pojemnoscME: '',
    imieKlienta: '',
    nazwiskoKlienta: '',
    kompatybilnosc: 0
  });

  const [expandedResults, setExpandedResults] = useState(false);
  const [expandedCalculator, setExpandedCalculator] = useState(false);
  const toggleResults = () => {
    setExpandedResults(!expandedResults);
    setExpandedCalculator(!expandedCalculator);
  };

  const handleOptionChange = (category, value) => {
    setSelectedOptions({ ...selectedOptions, [category]: value });
      if(value){
        if (category == "falowniki"){
          setSelectedOptions(prevState => ({
            ...prevState,
            kompatybilnosc: JSON.parse(value).Kompatybilnosc
          }));
          calculateResults({ ...selectedOptions, [category]: value });
          if(JSON.parse(selectedOptions.magazyny).Kompatybilnosc != JSON.parse(value).Kompatybilnosc){
            calculateResults({ ...selectedOptions, [category]: value , magazyny: '' });
          }
        }
      else{
        
      // Dodajemy logikę obliczeń tutaj, aby wyniki aktualizowały się na bieżąco
      calculateResults({ ...selectedOptions, [category]: value });
      }
    }
    else{
      
    // Dodajemy logikę obliczeń tutaj, aby wyniki aktualizowały się na bieżąco
    calculateResults({ ...selectedOptions, [category]: value });
    }
    
  };
  const calculateResults = ({
    moduly,
    liczbaModulow,
    falowniki,
    konstrukcje,
    koordynacja,
    magazyny,
    montaz,
    narzut,
    rodzajKlienta,
  }) => {
    if (!falowniki || !koordynacja || !montaz || !rodzajKlienta) {
      setSelectedOptions(prevState => ({
        ...prevState,
        sumaNetto: '',
        sumaVat: '',
        sumaBrutto: '',
        sumaNettoKlienta: '',
        sumaVatKlienta: '',
        sumaBruttoKlienta: '',
        zarobek: '',
        mocPV: '',
        pojemnoscME: ''
      }));
    }
    
    const cenaFalownika = parseFloat(JSON.parse(falowniki).Cena);
    const cenaMontazu = parseFloat(JSON.parse(montaz).Cena);
    const cenaKoordynacji = parseFloat(JSON.parse(koordynacja).Cena);
    const wysokoscNarzutu = parseFloat(narzut);
    const vat = rodzajKlienta === 'Klient biznesowy' ? 0.23 : 0.08;
    const narzutBazowy = isPermissionAccess ? 1 : 1.25;

    const iloscModulow = parseInt(liczbaModulow);
    let mocPVH;
    let sumaNettoH;
    let sumaBruttoH;
    if(moduly){
      const cenaKonstrukcji = parseFloat(JSON.parse(konstrukcje).Cena);
      const cenaModulu = parseFloat(JSON.parse(moduly).Cena);
      mocPVH = (JSON.parse(moduly).Moc * iloscModulow / 1000);
      sumaNettoH = cenaModulu * iloscModulow +
                       cenaFalownika +
                       cenaKonstrukcji * iloscModulow +
                       cenaMontazu * mocPVH +
                       cenaKoordynacji * mocPVH;

    sumaBruttoH = cenaModulu * iloscModulow * 1.23 +
                      cenaFalownika * 1.23 +
                      cenaKonstrukcji * iloscModulow * 1.23 +
                      cenaMontazu * mocPVH * (1 + vat) +
                      cenaKoordynacji * mocPVH * 1.23;

    if (magazyny) {
      const cenaMagazynu = parseFloat(JSON.parse(magazyny).Cena);
      sumaNettoH += cenaMagazynu;
      sumaBruttoH += cenaMagazynu * 1.23;
    }
  }
  else{      
    const cenaMagazynu = parseFloat(JSON.parse(magazyny).Cena);
    sumaNettoH = cenaMagazynu + cenaFalownika +
    1000 + 1000

    sumaBruttoH = cenaMagazynu * 1.23 + cenaFalownika * 1.23 +
      1000 * (1 + vat) +
      1000 * 1.23;

  }
    const cenaBazowaH = sumaBruttoH*narzutBazowy
    const sumaVatH = cenaBazowaH - sumaNettoH;
    const sumaNettoKlientaH = cenaBazowaH + wysokoscNarzutu;
    const sumaBruttoKlientaH = sumaNettoKlientaH * (1 + vat);
    const sumaVatKlientaH = sumaBruttoKlientaH - sumaNettoKlientaH;
    const wartoscPodatku = sumaNettoKlientaH * 0.055;
    const zarobekH = (sumaBruttoKlientaH - cenaBazowaH) - wartoscPodatku - sumaVatKlientaH;

    setSelectedOptions(prevState => ({
      ...prevState,
      sumaNetto: sumaNettoH.toFixed(2),
      sumaVat: sumaVatH.toFixed(2),
      sumaBrutto: sumaBruttoH.toFixed(2),
      cenaBazowa: cenaBazowaH.toFixed(2),
      sumaNettoKlienta: sumaNettoKlientaH.toFixed(2),
      sumaVatKlienta: sumaVatKlientaH.toFixed(2),
      sumaBruttoKlienta: sumaBruttoKlientaH.toFixed(2),
      zarobek: zarobekH.toFixed(2),
      mocPV: moduly ? mocPVH.toFixed(2) : '',
      pojemnoscME: magazyny ? JSON.parse(magazyny).Pojemnosc : ''
    }));
  };

  return (
<div className="app">
      {isLoggedIn ? (
        <>
          <LogoutButton handleLogout={handleLogout} />
          {isPermissionAccess ? (
            <button className="expandNav" onClick={() => setIsOpenNav(!isOpenNav)}>Zmień widok</button>
          ) : <></>}
          {isOpenNav ? (
            <>
              <Clients data={data} />
              <RegisterForm setIsLoggedIn={setIsLoggedIn} setIsPermissionAccess={setIsPermissionAccess} />
            </>
          ) : (
            <div className="calculator">
              <Calculator
                data={data}
                selectedOptions={selectedOptions}
                isLoggedIn={isLoggedIn}
                isPermissionAccess={isPermissionAccess}
                handleOptionChange={handleOptionChange}
                handleSaveResults={handleSaveResults}
                expandedResults={expandedResults}
                toggleResults={toggleResults}
              />
              <Results
                selectedOptions={selectedOptions}
                isLoggedIn={isLoggedIn}
                isPermissionAccess={isPermissionAccess}
                handleOptionChange={handleOptionChange}
                handleSaveResults={handleSaveResults}
                message={message}
                calculateResults={calculateResults}
                expandedResults={expandedResults}
                toggleResults={toggleResults}
              />
            </div>
          )}
        </>
      ) : (
        <div className="calculator">
          <LoginForm onLogin={handleLogin} />
        </div>
      )}
    </div>
  );
}

export default App;