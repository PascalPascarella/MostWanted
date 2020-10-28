"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  do{
    switch(searchType){
      case 'yes':
        searchResults = searchByName(people);
        return mainMenu(searchResults, people);
        break;
      case 'no':
        let numberOfTraits = Number(promptFor("How many traits do want to search for?", chars));
        switch(numberOfTraits){
          case "1":
            searchResults = searchByTrait(people);
            break;
          default:
            searchResults = searchByTraits(people, numberOfTraits);
        }
        // choose search by single or multiple trait
        // TODO: search by traits
        break;
        default:
          app(people); // restart app
          break;
        }
        if(searchResults.length === 0){
          prompt("No results found. Application will restart.")
          app(people);
        }
        // Finish logic later - select to further refine or display one of result objects
        else{
          promptFor(displayPeople(searchResults));
    }
  }
  while(searchResults.length > 1)
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
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
    // TODO: get person's family
    let family = listFamily(person, people);
    alert("Family of " + person.firstName + " " + person.lastName + ":\n" + family);
    return mainMenu(person, people);
    break;
    case "descendants":
    // TODO: get person's descendants
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
  return foundPeople;
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
