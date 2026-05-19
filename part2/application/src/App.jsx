import { use, useState } from 'react'
import Persons from "./components/Persons.jsx"
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  
  return (
    <div>
      <h2>Phonebook</h2>

      <Filter 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
      />

      <h2>Add New</h2>

      <PersonForm 
        persons={persons} 
        setPersons={setPersons} 
        newName={newName} 
        setNewName={setNewName} 
        newNumber={newNumber} 
        setNewNumber={setNewNumber}
      />
      
      <h2>Numbers</h2>

      <Persons 
        persons={persons} 
        searchQuery={searchQuery}
      />
    </div>
  )
}


export default App