"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      let numberOfTraits = Number(promptFor("How many traits do want to search for?", chars));
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

  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
      displayPerson(person);
      return mainMenu(person, people);
    case "family":
      let family = listFamily(person, people);
      alert("Family of " + person.firstName + " " + person.lastName + ":\n" + family);
      return mainMenu(person, people);
    break;
    case "descendants":
      let descendants = findDescendants(person, people);
      displayPeople(descendants);
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
  output += "PARENTS\n" + listPeopleAsString(parents) + "\n";
  output += "SIBLINGS\n" + listPeopleAsString(siblings) + "\n";
  if(spouse !== undefined){
    output += "SPOUSE\n" + spouse.firstName + " " + spouse.lastName + "\n";
  } else {
    output += "SPOUSE\nNo results.\n"
  }
  output += "CHILDREN\n" + listPeopleAsString(children);
  return output;
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

function listPeopleAsString(people){
  let string;
    if(people.length > 0){
      string = people.map(function(person){
        return person.firstName + " " + person.lastName;
      }).join("\n");
    } else {
      string = "No results."
    }
  return string;
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

function searchByTrait(people){
  // .trim() to remove whitespace
  let traitQuery = promptFor("Enter trait: height, weight, age, eyeColor, gender, occupation: ", chars);
  let traitValue = promptFor("Enter value for " + traitQuery, chars);
  let foundPeople = people.filter(function(person){
    if(person[traitQuery] == traitValue){
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
      prompt("No results found. Application will restart.")
      return app(people);
    }
    else{
      displayPeople(foundPeople);
      let userInput = promptFor("Continue to 'refine' by trait, or 'choose' person to display.", chars);
      switch(userInput){
        case "refine":
          foundPeople = searchByTrait(foundPeople);
          break;
        case "choose":
          let output = "Choose person to display:";
          for (let i = 0; i < foundPeople.length; i++){
            output += "\nPress " + i + " for " + foundPeople[i].firstName + " " + foundPeople[i].lastName;
          }
          let chosenPerson = promptFor(output, chars);
          return foundPeople[chosenPerson];
      }
    }
  }
  while(true);
}

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Age: " + calculateAge(new Date(person.dob)) + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
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
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}
