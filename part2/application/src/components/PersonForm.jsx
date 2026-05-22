import axios from "axios";
import noteServices from "../services/notes";

const PersonForm = ({
  persons,
  setPersons,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
  setSuccessMessage,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const newPersonObj = {
      name: newName,
      number: newNumber,
    };
    const alreadyExists = persons.some(
      (person) => newPersonObj.name === person.name,
    );

    if (alreadyExists) {
      const answer = confirm(
        `${newPersonObj.name} is already added to phonebook, replace the old number with a new one?`,
      );

      if (answer) {
        const personObj = persons.find(
          (person) => newPersonObj.name === person.name,
        );

        const updatedPersonObj = { ...personObj, number: newNumber };
        noteServices
          .put(personObj.id, updatedPersonObj)
          .then((response) => {
            console.log(response.data);
            setPersons(
              persons.map((p) => (p.id === personObj.id ? response.data : p)),
            );
            setNewName("");
            setNewNumber("");
            setSuccessMessage(`${personObj.name} has a new number now`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000)
          })
          .catch((err) => {
            console.log(`${err} has occured!`);
          });
      } else {
        return;
      }
    } else {
      noteServices
        .create(newPersonObj)
        .then((response) => {
          console.log(response.data);
          setPersons(persons.concat(response.data));
          setNewName("");
          setNewNumber("");
          setSuccessMessage(`Added ${newPersonObj.name}`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        })
        .catch((err) => {
          console.log(`${err} has occured!`);
        });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name:{" "}
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          onChange={(event) => setNewNumber(event.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
