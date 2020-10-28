"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo);
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      let numberOfTraits = Number(promptFor("How many traits do want to search for?", number));
      searchResults = searchByTraits(people, numberOfTraits);
      break;
    default:
      app(people); // restart app
      break;
  }
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = promptFor("Found " + person.firstName + " " + person.lastName + ". Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", chars);

  switch(displayOption){
    case "info":
      displayPerson(person);
      return mainMenu(person, people);
    case "family":
      let family = listFamily(person, people);
      alert("Family of " + person.firstName + " " + person.lastName + ":\n\n" + family);
      return mainMenu(person, people);
    break;
    case "descendants":
      let descendants = findDescendants(person, people);
      alert(listPeopleAsString(descendants, ("Descendants of " + person.firstName + " " + person.lastName + ":\n")));
      return mainMenu(person, people);
    break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}

function listFamily(person, people) {
  let parents = [];
  let siblings = [];
  let children = [];
  let spouse;
  let output = "";
    for (let i = 0; i < people.length; i++){
      if(person.id !== people[i].id){
        if(people[i].parents.includes(person.id)){
          children.push(people[i]);
        } else if(person.parents.includes(people[i].id)){
          parents.push(people[i]);
        } else if(person.id === people[i].currentSpouse){
          spouse = people[i];
        } else {
          for(let index = 0; index < person.parents.length && !siblings.includes(people[i]); index++){
            if(people[i].parents.includes(person.parents[index])){
              siblings.push(people[i])
            }
          }
        }
      }
    }
  output += listPeopleAsString(parents, "PARENTS");
  output += listPeopleAsString(siblings, "SIBLINGS");
  if(spouse !== undefined){
    output += "SPOUSE\n" + " " + " " + " " + "-" + spouse.firstName + " " + spouse.lastName + "\n\n";
  } else {
    output += "SPOUSE\n" + " " + " " + " " + "-" + "No results.\n\n"
  }
  output += listPeopleAsString(children, "CHILDREN");
  return output;
}

function listPeopleAsString(people, titleOfDataSet){
  let string;
    if(people.length > 0){
      string = people.map(function(person){
        return " " + " " + " " + "-" + person.firstName + " " + person.lastName;
      }).join("\n");
    } else {
      string = " " + " " + " " + "-" + "No results.\n\n"
    }
  return string = titleOfDataSet + "\n" + string;
}

function findDescendants(person, people) {
  let descendants = [];
  for (let i = 0; i < people.length; i++){
    if(people[i].parents.includes(person.id)){
      descendants.push(people[i]);
    }
  }
  for (let i = 0; i < descendants.length; i++) {
    descendants = descendants.concat(findDescendants(descendants[i], people)
    );
  }
  return descendants;
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPerson[0];
}

let traits = [];

function traitsToString(traits) {
  let traitsList = "";
  traits.forEach(element => {
    traitsList += element;
  });
  return traitsList;
}

function searchByTrait(people){
  let traitQuery = promptFor("Enter trait: height, weight, age, eye color, gender, occupation", trait);
  let traitValue = promptFor("Enter value for " + traitQuery, chars);
  traits.push("\n" + traitQuery + " of " + traitValue);
  let foundPeople = people.filter(function(person){
    if(person[simplifier(traitQuery)] == traitValue){
      return true;
    }
    else{
      return false;
    }
  })
  return foundPeople;
}

function searchByTraits(people, numberOfTraits){
  let foundPeople = people;
  for (let i = 0; i < numberOfTraits; i++){
    foundPeople = searchByTrait(foundPeople);
  }
  do{
    if(foundPeople.length === 0){
      alert("No results found. Application will restart.")
      return app(people);
    }
    else{
      let userInput = promptFor(listPeopleAsString(foundPeople, (foundPeople.length + " people matching your search for:" + traitsToString(traits))) + "\nContinue to 'refine' by trait, or 'choose' person to display.", refineChoose);
      switch(userInput){
        case "refine":
          foundPeople = searchByTrait(foundPeople);
          break;
        case "choose":
          let output = "Choose person to display:";
          for (let i = 0; i < foundPeople.length; i++){
            output += "\nEnter " + i + " for " + foundPeople[i].firstName + " " + foundPeople[i].lastName;
          }
          let chosenPerson = promptFor(output, number);
          traits = [];
          return foundPeople[chosenPerson];
      }
    }
  }
  while(true);
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Height: " + person.height + "\"\n";
  personInfo += "Weight: " + person.weight + " lbs.\n";
  personInfo += "Age: " + calculateAge(new Date(person.dob)) + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  personInfo += "Eye Color: " + person.eyecolor + "\n";
  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}

function calculateAge(dob){
  let now = new Date();
  let age = now - dob;
  age = Math.floor(age/1000/60/60/24/365.25);
  return age
}

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return simplifier(input) == "yes" || simplifier(input) == "no";
}

function refineChoose(input){
  return simplifier(input) == "refine" || simplifier(input) == "choose";
}

// Refine validation
/*
function twoChoices(input, choiceOne, choiceTwo) {
  return simplifier(input) == choiceOne || simplifier(input) == choiceTwo;
}
*/

// helper function to pass in as default promptFor validation
function chars(input){
  let chars = /^[A-Za-z]+$/;
  for (let i = 0; i < input.length; i++) {
    if (input[i].match(chars)) {
        return true;
    }
    if (number(input)){
      return true;
    }
  }
  return false; // default validation only
}

function number(input){
  let numbers = /^[0-9]+$/;
  for (let i = 0; i < input.length; i++) {
    if (input[i].match(numbers)) {
        return true;
    }
  }
  return false; // default validation only
}

function trait(input){
  let traits = ["height", "weight", "age", "eyecolor", "gender", "occupation"]
  for (let i = 0; i < traits.length; i++) {
    if (simplifier(input).match(traits[i])) {
        return true;
    }
  }
  return false;
}

function simplifier(input){
  return input.toLowerCase().split(" ").join("");
}