import noteServices from "../services/notes";

const Persons = ({
  persons,
  setPersons,
  searchQuery,
  setSuccessMessage,
  setErrorMessage,
}) => {
  const filteredPersons = persons.filter((person) => {
    if (!person || !person.name) {
      return false;
    }
    return person.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDelete = (id, name) => {
    const result = confirm(`Do you really want to delete ${name}?`);

    if (result) {
      noteServices
        .deleteByID(id)
        .then((reponse) => {
          setPersons(persons.filter((person) => person.id !== id));
          setSuccessMessage(`Deleted ${name}`);
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch((error) => {
          setErrorMessage(`${name} has already been removed from the server!`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          setPersons(persons.filter((person) => person.id !== id));
        });
    } else {
      return;
    }
  };

  return filteredPersons.map((person) => (
    <div key={person.name}>
      <p>
        {person.name} {person.number}{" "}
        <button onClick={() => handleDelete(person.id, person.name)}>
          delete
        </button>
      </p>
    </div>
  ));
};

export default Persons;
