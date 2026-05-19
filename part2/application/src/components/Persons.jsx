const Persons = ({ persons, searchQuery }) => {
    const filteredPersons = persons.filter((person) => person.name.toLowerCase().includes(searchQuery.toLowerCase()))

    return filteredPersons.map((person) => (
      <div key={person.name}>
        <p>{person.name} {person.number}</p>
      </div>
    ))
}

export default Persons