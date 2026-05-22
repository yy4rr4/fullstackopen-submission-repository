import { use, useEffect, useState } from "react";
import axios from "axios";
import Persons from "./components/Persons.jsx";
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Notification from "./components/Notification.jsx";
import noteServices from "./services/notes.js"

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  useEffect(() => {
    noteServices.getAll().then((response) => {
      console.log(response.data);
      setPersons(response.data);
    });
  }, []);
  

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

      <Filter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <h2>Add New</h2>

      <PersonForm
        persons={persons}
        setPersons={setPersons}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        setSuccessMessage={setSuccessMessage}
        setErrorMessage={setErrorMessage}
      />

      <h2>Numbers</h2>

      <Persons
        persons={persons}
        setPersons={setPersons}
        searchQuery={searchQuery}
        setSuccessMessage={setSuccessMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};

export default App;
