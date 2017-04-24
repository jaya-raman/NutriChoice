
var baseUrl = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/";
//productionKey
// var mashapeKey = "ip0pFVt0IamshZ8xUr0dhNQhBArmp12fdqdjsnmTBFoAipNjid";
//testKey
var mashapeKey = "V8LgO9xnyAmshdOH0OjtyW0rcpuWp1yLyd0jsn2AnxQDjbFR34";
var recipeId = localStorage.recipeId;

function start() {
  if(recipeId) {
    getRecipe();
  }
  else {
    document.writeln("<p>. Unable to find the recipe");
  }
}

function getRecipe() {
  try {
    var searchUrl = baseUrl + "recipes/"+ recipeId +"/information?includeNutrition=true";
    var recipeRequest = new XMLHttpRequest();
    recipeRequest.addEventListener("readystatechange",function() { displayRecipeInfo(recipeRequest); },false);
    recipeRequest.open("GET",searchUrl,true);
    recipeRequest.setRequestHeader("accept","application/json;charset=utf-8");
    recipeRequest.setRequestHeader("X-Mashape-Key", mashapeKey);
    recipeRequest.send();
  }
catch (e) {
  alert("Oops! Something went wrong with the request");
  }
}

function displayRecipeInfo(recipeRequest) {
console.log("request sent");
if(recipeRequest.readyState == 4 && recipeRequest.status == 200) {
  var data = JSON.parse(recipeRequest.responseText);

  document.getElementById("recipeTitle").innerHTML = data.title;
  document.getElementById("recipeImg").src = data.image;
  document.getElementById("calorieInfo").innerHTML = data.nutrition.nutrients[0].amount;
  document.getElementById("recipeTime").innerHTML = data.readyInMinutes + "minutes";
  document.getElementById("servingSize").innerHTML = data.servings;
  document.getElementById("recipeSource").innerHTML = data.sourceName;
  document.getElementById("vegCheck").innerHTML = data.vegetarian == true ? "Yes" : "No";
  document.getElementById("glutenCheck").innerHTML = data.glutenFree == true ? "Yes" : "No";
  document.getElementById("dairyCheck").innerHTML = data.dairyFree == true ? "Yes" : "No";

//Write the required Ingredients
  var IngHeading = document.createElement("h3");
  var sheading = document.createElement("strong");
  sheading.innerHTML ="Required Ingredients";
  IngHeading.appendChild(sheading);

  var ingredientsList = document.createElement("ul");
  ingredientsList.setAttribute("id","ingredientsList");

  for(var i=0; i < data.extendedIngredients.length; i++) {
    var ingredientsName = document.createElement("li");
    ingredientsName.innerHTML = data.extendedIngredients[i].originalString;
    ingredientsName.setAttribute("id",data.extendedIngredients[i].id);
    var findSub = document.createElement("a");
    findSub.innerHTML = " alt? ";
    findSub.title = "find an equivalent alternate ingredient";
    findSub.setAttribute("parentId",data.extendedIngredients[i].id);
    findSub.addEventListener("click",findSubstitueIngredient,false);
    ingredientsName.appendChild(findSub);
    ingredientsList.appendChild(ingredientsName);
  }

  var ingredientsEle = document.getElementById("reqIngredients");
  //remove the previous recipe's Ingredients(if any)
  while (ingredientsEle.hasChildNodes()) {
    ingredientsEle.removeChild(ingredientsEle.lastChild);
  }
  document.getElementById("reqIngredients").appendChild(IngHeading);
  document.getElementById("reqIngredients").appendChild(ingredientsList);

// Remove the previous recipe's Instructions and similar recipes(if any)
  var parentDiv = document.getElementById("wrapperContainer");

  if(parentDiv.children.length > 2 )
      parentDiv.removeChild(parentDiv.children[2]);
  if(parentDiv.children.length > 1 )
        parentDiv.removeChild(parentDiv.children[1]);
//build the recipe Instructions
  var InsHeading = document.createElement("h3");
  var strongheading = document.createElement("strong");
  strongheading.innerHTML ="Recipe Instructions";
  InsHeading.appendChild(strongheading);

  var analyzedInstructions = document.createElement("ol");
  if(data.analyzedInstructions.length) {
    for(var i=0; i < data.analyzedInstructions[0].steps.length; i++) {
      var step = document.createElement("li");
      step.innerHTML = data.analyzedInstructions[0].steps[i].step;
      analyzedInstructions.appendChild(step);
    }
  }
  else {
      analyzedInstructions.innerHTML = "Sorry. No Instruction available for this recipe";
  }

  var recipeIns = document.createElement("div");
  recipeIns.setAttribute("id","recipeInstruction");

  recipeIns.appendChild(InsHeading);
  recipeIns.appendChild(analyzedInstructions);

  var hrline = document.createElement("hr");
  recipeIns.appendChild(hrline);
  document.getElementById("wrapperContainer").appendChild(recipeIns);

  getRelatedRecipes();
  }
}

function getRelatedRecipes() {
  try {
    var searchUrl = baseUrl + "recipes/"+ recipeId +"/similar";
    var similarRecipeRequest = new XMLHttpRequest();
    similarRecipeRequest.addEventListener("readystatechange",function() { displayRelatedRecipes(similarRecipeRequest); },false);
    similarRecipeRequest.open("GET",searchUrl,true);
    similarRecipeRequest.setRequestHeader("accept","application/json;charset=utf-8");
    similarRecipeRequest.setRequestHeader("X-Mashape-Key", mashapeKey);
    similarRecipeRequest.send();
  }
catch (e) {
  alert("Oops! Something went wrong with the request");
  }
}

function displayRelatedRecipes(similarRecipeRequest) {
  if(similarRecipeRequest.readyState == 4 && similarRecipeRequest.status == 200) {
    var data = JSON.parse(similarRecipeRequest.responseText);

    var parentDiv = document.getElementById("wrapperContainer");
        //Start of simiar recipies
        var relatedHeading = document.createElement("h3");
        var strongheading = document.createElement("strong");
        strongheading.innerHTML ="You might also like ";
        relatedHeading.appendChild(strongheading);

        var relatedRecipiesDiv = document.createElement("div");
        relatedRecipiesDiv.setAttribute("id","relatedRecipies");
        relatedRecipiesDiv.appendChild(relatedHeading);

        for(var i=0;i < data.length;i++) {
          //creating the recipe Image and its caption
          var img = document.createElement("img");
          img.src = "https://spoonacular.com/recipeImages/" + data[i].imageUrls[0];
          img.alt = "image of" + data[i].title;
          var title = document.createElement("p");
          title.innerHTML = data[i].title;

          var info = document.createElement("div");
          info.appendChild(img);
          info.appendChild(title);

          //create an anchor to hold the similar recipes data
          var relatedRecipeBlock = document.createElement("a");
          relatedRecipeBlock.setAttribute("href","#");
          relatedRecipeBlock.addEventListener("click",loadNewRecipe,false);
          relatedRecipeBlock.id = data[i].id;
          relatedRecipeBlock.appendChild(info);

          var relatedItems = document.createElement("div");
          relatedItems.appendChild(relatedRecipeBlock);
          //append the whole similar set of recipes to the wrapper div
          relatedRecipiesDiv.appendChild(relatedItems);
    }
    //add to the parent container
    parentDiv.appendChild(relatedRecipiesDiv);
  }
}

function loadNewRecipe(e) {
  recipeId = e.currentTarget.getAttribute("id");
  start();
}

function findSubstitueIngredient(e) {
  var ingredientId = e.currentTarget.getAttribute("parentId");
  try {
    var searchUrl = baseUrl + "food/ingredients/" +ingredientId+ "/substitutes";
    var subIngRequest = new XMLHttpRequest();
    subIngRequest.addEventListener("readystatechange",function() { displaysubIng(subIngRequest,ingredientId); },false);
    subIngRequest.open("GET",searchUrl,true);
    subIngRequest.setRequestHeader("accept","application/json;charset=utf-8");
    subIngRequest.setRequestHeader("X-Mashape-Key", mashapeKey);
    subIngRequest.send();
  }
catch (e) {
  alert("Oops! Something went wrong with the request");
  }
}

function displaysubIng(subIngRequest,parentId) {
      var ingredient = document.getElementById(parentId);
      var originalString;
      if(subIngRequest.readyState == 4 && subIngRequest.status == 200) {
        var data = JSON.parse(subIngRequest.responseText);
        //get the original Ingredient value
        var ingredient = document.getElementById(parentId);
        originalString = ingredient.innerHTML;
        //remove the original ingredient
        if (ingredient.children[0]) {
          ingredient.removeChild(ingredient.children[0]);
        }

        ingredient.innerHTML = "";
        //add the new ingredient
        if(data.status == "success") {
          for(var i=0; i < data.substitutes.length; i++) {
            ingredient.innerHTML += data.substitutes[i];
          }
        }
        else {
            ingredient.innerHTML += data.message;
            }
        //add an option to go back to the original Ingredient
        var cancelTag = document.createElement("a");
        cancelTag.innerHTML = " <<";
        cancelTag.addEventListener("click",function() { ingredient.innerHTML = originalString;
          if(ingredient.children[0]) { ingredient.children[0].addEventListener("click",findSubstitueIngredient,false);} },false);
        ingredient.appendChild(cancelTag);
      }
}
window.addEventListener("load",start,false);
