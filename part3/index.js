require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

// 3.13: Fetch all phonebook entries from MongoDB Atlas
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// 3.14: Save new entries to MongoDB Atlas
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
