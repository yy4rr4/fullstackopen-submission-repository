import axios from 'axios'
import noteServices from '../services/notes'

const PersonForm = ({
  persons,
  setPersons,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  setSuccessMessage,
  setErrorMessage
}) => {
  const handleSubmit = (event) => {
    event.preventDefault()
    const newPersonObj = {
      name: newName,
      number: newNumber
    }
    const alreadyExists = persons.some(
      (person) => newPersonObj.name === person.name
    )

    if (alreadyExists) {
      const answer = confirm(
        `${newPersonObj.name} is already added to phonebook, replace the old number with a new one?`
      )

      if (answer) {
        const personObj = persons.find(
          (person) => newPersonObj.name === person.name
        )

        const updatedPersonObj = { ...personObj, number: newNumber }
        noteServices
          .put(personObj.id, updatedPersonObj)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) => (p.id === personObj.id ? returnedPerson : p))
            )
            setNewName('')
            setNewNumber('')
            setSuccessMessage(`${personObj.name} has a new number now`)
            setTimeout(() => {
              setSuccessMessage(null)
            }, 5000)
          })
          .catch((err) => {
            setErrorMessage(err.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      } else {
        return
      }
    } else {
      noteServices
        .create(newPersonObj)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`Added ${newPersonObj.name}`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch((err) => {
          setErrorMessage(err.response.data.error)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </div>
      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm
