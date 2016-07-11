#!/usr/bin/env node

'use strict';

const customers = require("./data/customers.json");
const ld = require("./node_modules/lodown-djdaquin/index.js");

/**
 * 1. Import your lodown module using the require() method
 * 2. Solve all problems as outlined in the README.
 */
 
//PROBLEM 1

function numMales (){
    let array = ld.filter(customers, function(customer){
        if(customer.gender === "male") return true;
        return false;
        //Creates an array with all males
    });
    return array.length;
    //returns the length of that array
}
 
//console.log(numMales());
 
 //PROBLEM 2

function numFemales (){
    let array = ld.filter(customers, function(customer){
        if(customer.gender === "female") return true;
        return false;
    });
    //creates an array of all females
    return array.length;
    //returns the length of that array
}

//console.log(numFemales()); 

//PROBLEM 3

function oldAndYoung (){
    let ages = ld.pluck(customers, "age");
    //gets an array of all the ages.
    let youngPos;
    let youngestAge = ld.reduce(ages, function(youngest, challenger, i){
        if (challenger < youngest){
            youngPos = i;
            return challenger;
        } // reduces down to the youngest age, also 
        //captures the position of youngest as side effect
        return youngest;
    });
    let oldPos;
    let oldestAge = ld.reduce(ages, function(oldest, challenger, i){
        if(challenger > oldest){
            oldPos = i;
            return challenger;
        }//reduces down to oldest age, also captures 
        //the position as side effect. 
        return oldest;
    })
    return [customers[oldPos]["name"], customers[youngPos]["name"]];
    //returns the name of the oldest customer, than the youngest.
}

//console.log(oldAndYoung());


//PROBLEM 4

function avgBalance (){
    let balances = ld.pluck(customers, "balance");
    // creates an array of all the balances
    balances = ld.map(balances, function(bal, i, balances){
        let value = bal.slice(1);
        value = value.replace(",","");
        return Number(value);
        //takes all values, which were strings with "$" & ","
        //and makes them numbers
    });
    let totalBalance = ld.reduce(balances, function(total, bal){
        return total + bal;
        //reduces down to a total balance
    });
    return totalBalance / balances.length;
    //returns average
}

//console.log(avgBalance());


//PROBLEM 5

function nameStarts (letter){
    let names = ld.pluck(customers, "name");
    //creates array of all the names
    let allStart = ld.filter(names, function(val, i, names){
        return names[i][0].toUpperCase() === letter.toUpperCase();
    });
    // creates array of all names that start with that letter
    return allStart.length;
    // returns length of that array
}

//console.log(nameStarts("a"));


//PROBLEM 6

function friendNameStarts(letter){
    let matches = 0;
    ld.each(customers,function(val, i, customers){
        //loop through customers
        ld.each(val.friends, function(friend){
            //loop through that customers friends
            if(friend["name"][0].toUpperCase() === letter.toUpperCase()) matches++;
            // counts up if the first letter matches the given letter,
            // not case sensitive
        });
    });
    return matches;
}

//console.log(friendNameStarts("j"));

//PROBLEM 7

function custAreFriends () {
    let count = 0;
    ld.each(customers, function(customer){
        //loops through customers
        ld.each(customer.friends, function(friend){
            //loops through that customer's friends
            ld.each(customers, function(customerJ){
                //for that friend, loop through customers again
                if (customerJ.name === friend.name) count++;
                //if the name of the customer matches the friends name,
                //count up
            });
        });
    });
    return count;
}

console.log(custAreFriends());

//PROBLEM 8

function topTags (amount) {
    let allTags = [];
    ld.each(customers, function(customer){
       ld.each(customer.tags, function(tag){
           //loop through all customers and their tags and
           //pushes them into the allTags array
           allTags.push(tag);
       });
    });
    let uniques = ld.unique(allTags);
    //creates array of unique tags.
    let uniqueCount = [];
    ld.each(uniques, function(utag){
        let counter = 0;
        ld.each(allTags, function(tag){
            if(tag === utag) counter++;
        });
        uniqueCount.push(counter);
        //creates an array of how many times a unique tag
        //shows up in all tags. The index matches up with uniques.
    });
    let results = [];
    while (results.length < amount){
        //runs up until we get as many as we need. 
        let ind = 0;
        ld.reduce(uniqueCount, function(max, challenger, i){
            if(max < challenger){
                ind = i;
                return challenger;
            }
            return max;
        });
        //reduce function finds the index of the highest count.
        results.push(uniques[ind]);
        //push the tag that has the highest
        uniques.splice(ind,1);
        uniqueCount.splice(ind,1);
        //remove highest values from their array
        //on next loop will get next highest. 
    }
    return results;
}

//Other way: use array.sort() method. Google it. 

//console.log(topTags(3));

//PROBLEM 9 
function genderSummary (){ 
    var genders = ld.unique(ld.pluck(customers, "gender"));
    // Finds all genders used in the JSON file and makes an array of them
    var gendersSumd = {};
    //creating object to hold results
    ld.each(genders, function(gend){
        let array = ld.filter(customers, function(obj, i, customers){
            if (gend === obj.gender) return true;
            return false;
        });
        //For each gender, create an array of objects that have
        //that gender
        gendersSumd[gend] = array.length;
        //Add the property of "Gender: Amount" to the results object
    });

 return gendersSumd;
}



//console.log(genderSummary());


/**
 * This "worked" but was just exploring. Keeping
 * it here because I like it at the moment. 
 */

// var genderStats = [];

// ld.each(genders, function(val){
//     let array = ld.filter(customers, function(obj, i, customers){
//         if (val === obj.gender) return true;
//         return false;
//     });
//     let results = {
//         gender: val,
//         amount: array.length
//     };
//     genderStats.push(results);
// })

// console.log(genderStats);

