const PersonForm = ({ persons, setPersons, newName, setNewName, newNumber, setNewNumber }) => {
    const handleSubmit = (event) => {
        event.preventDefault()
        const newPersonObj = {
        name: newName,
        number: newNumber
        }
        const alreadyExists = persons.some(person => newPersonObj.name === person.name)
        console.log(alreadyExists)

        alreadyExists 
        ? alert(`${newPersonObj.name} is already added to phonebook`)
        : setPersons(persons.concat(newPersonObj))
        
        setNewName('')
        setNewNumber('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
            name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
            </div>
            <div>
            number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} />
            </div>
            <div>
            <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm