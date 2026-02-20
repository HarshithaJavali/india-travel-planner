import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // ---------- DATA ----------
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [places, setPlaces] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // ---------- BUDGET PLANNER ----------
  const [people, setPeople] = useState("");
  const [days, setDays] = useState("");
  const [userBudget, setUserBudget] = useState("");
  const [budgetResult, setBudgetResult] = useState(null);

  // ---------- ITINERARY ----------
  const [itinerary, setItinerary] = useState([]);

  // ---------- LOAD STATES ----------
  useEffect(() => {
    axios.get("/api/states").then((res) => {
      setStates(res.data);
    });
  }, []);

  // ---------- LOAD CITIES ----------
  useEffect(() => {
    if (selectedState) {
      axios.get(`/api/cities/${selectedState}`).then((res) => {
        setCities(res.data);
      });
    } else {
      setCities([]);
    }
    setSelectedCity("");
    setPlaces([]);
    setItinerary([]);
    setBudgetResult(null);
  }, [selectedState]);

  // ---------- LOAD PLACES ----------
  useEffect(() => {
    if (selectedCity) {
      axios.get(`/api/places/${selectedCity}`).then((res) => {
        setPlaces(res.data);
      });
    } else {
      setPlaces([]);
    }
    setItinerary([]);
  }, [selectedCity]);

  // ---------- GOOGLE MAP ----------
  const openGoogleMaps = (placeName) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      placeName
    )}`;
    window.open(url, "_blank");
  };

  // ---------- BUDGET CALCULATION ----------
  const calculateBudget = () => {
    if (!people || !days) {
      alert("Please enter number of people and days");
      return;
    }

    const stayCost = people * days * 1200;
    const foodCost = people * days * 500;
    const travelCost = people * 300;

    const total = stayCost + foodCost + travelCost;

    setBudgetResult({
      stayCost,
      foodCost,
      travelCost,
      total,
      withinBudget: userBudget ? total <= userBudget : null,
    });
  };

  // ---------- ITINERARY GENERATION ----------
  const generateItinerary = () => {
    if (!days || days <= 0) {
      alert("Please enter valid number of days");
      return;
    }

    const totalDays = Number(days);
    const perDay = Math.ceil(places.length / totalDays);
    const result = [];

    for (let i = 0; i < totalDays; i++) {
      result.push({
        day: i + 1,
        places: places.slice(i * perDay, (i + 1) * perDay),
      });
    }

    setItinerary(result);
  };

  return (
    <div className="container">
      <h1>🇮🇳 India Travel Planner</h1>

      {/* ---------- STATE ---------- */}
      <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state.state_id} value={state.state_id}>
            {state.state_name}
          </option>
        ))}
      </select>

      {/* ---------- CITY ---------- */}
      {cities.length > 0 && (
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="dropdown"
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city.city_id} value={city.city_id}>
              {city.city_name}
            </option>
          ))}
        </select>
      )}

      {/* ---------- PLACES ---------- */}
      {places.length > 0 && (
        <>
          <h2>Tourist Places</h2>

          <div className="places-grid">
            {places.map((place) => (
              <div className="place-card" key={place.place_id}>
                <h3>{place.place_name}</h3>
                <p>{place.description}</p>

                <button
                  className="map-btn"
                  onClick={() => openGoogleMaps(place.place_name)}
                >
                  📍 View on Google Maps
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ---------- BUDGET PLANNER ---------- */}
      {places.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h2>💰 Budget Planner</h2>

          <div className="budget-inputs">
            <div className="budget-field">
              <label>👥 Number of People</label>
              <input
                type="number"
                min="1"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="Eg: 2"
              />
            </div>

            <div className="budget-field">
              <label>📅 Number of Days</label>
              <input
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                placeholder="Eg: 3"
              />
            </div>

            <div className="budget-field">
              <label>💼 Trip Budget (optional)</label>
              <input
                type="number"
                value={userBudget}
                onChange={(e) => setUserBudget(e.target.value)}
                placeholder="Eg: 50000"
              />
            </div>

            <button onClick={calculateBudget}>Calculate Budget</button>
          </div>

          {budgetResult && (
            <div className="budget-result">
              <p>🏨 Stay: ₹{budgetResult.stayCost}</p>
              <p>🍽 Food: ₹{budgetResult.foodCost}</p>
              <p>🚕 Travel: ₹{budgetResult.travelCost}</p>
              <h3>Total: ₹{budgetResult.total}</h3>

              {budgetResult.withinBudget === true && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  ✅ Within budget
                </p>
              )}
              {budgetResult.withinBudget === false && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  ❌ Exceeds budget
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------- ITINERARY ---------- */}
      {places.length > 0 && days && (
        <div style={{ marginTop: 40 }}>
          <h2>🗓 Day-wise Itinerary</h2>

          <button onClick={generateItinerary}>
            Generate Itinerary
          </button>

          {itinerary.length > 0 && (
            <div className="itinerary-result">
              {itinerary.map((day) => (
                <div key={day.day} className="day-card">
                  <h3>Day {day.day}</h3>
                  {day.places.length > 0 ? (
                    <ul>
                      {day.places.map((p) => (
                        <li key={p.place_id}>{p.place_name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Free / Rest Day</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
