let recipes = [];  
  
// READ INITIAL JSON DATA  
async function loadRecipes() {  
    const table = document.getElementById("recipeTable");  
    table.innerHTML = `<tr><td colspan="5">Loading recipes... <span class="loader"></span></td></tr>`;  
  
    try {  
        const savedRecipes = localStorage.getItem("recipes");  
        if (savedRecipes) {  
            recipes = JSON.parse(savedRecipes);  
            displayRecipes(recipes);  
            return;  
        }  
        const response = await fetch("recipes.json");  
        if (!response.ok) {  
            throw new Error("Failed to load recipes");  
        }  
        const data = await response.json();  
        recipes = data.recipes;  
        localStorage.setItem(  
            "recipes",  
            JSON.stringify(recipes)  
        );  
        displayRecipes(recipes);  
    } catch (error) {  
        table.innerHTML = `<tr><td colspan="5">Unable to load recipes. Please try again.</td></tr>`;  
        console.error(error);  
    }  
}  
  
// DISPLAY THE RECIPES  
function displayRecipes(recipeList) {  
    const table = document.getElementById("recipeTable");  
    table.innerHTML = "";  
    if (recipeList.length === 0) {  
        table.innerHTML = `<tr><td colspan="5">No recipes available.</td></tr>`;  
        return;  
    }  
    recipeList.forEach(recipe => {  
        const row = document.createElement("tr");  
        row.innerHTML = `  
            <td>${recipe.id}</td>  
            <td>${recipe.name}</td>  
            <td>${recipe.cuisine}</td>  
            <td>${recipe.prepTime}</td>  
            <td>  
                <button  
                    class="edit"  
                    onclick="editRecipe(${recipe.id})">  
                    Edit  
                </button>  
                <button  
                    class="delete"  
                    onclick="deleteRecipe(${recipe.id})">  
                    Delete  
                </button>  
            </td>  
        `;  
        table.appendChild(row);  
    });  
}  
  
// CREATE - ADD RECIPE  
document  
    .getElementById("recipeForm")  
    .addEventListener("submit", function(event) {  
        event.preventDefault();  
        const name =document.getElementById("recipeName").value;  
        const cuisine =document.getElementById("cuisine").value;  
        const prepTime =document.getElementById("prepTime").value;  
        const newId =recipes.length > 0? Math.max(...recipes.map(recipe => recipe.id)) + 1:1;  
        const newRecipe = {  
            id: newId,  
            name: name,  
            cuisine: cuisine,  
            prepTime: prepTime  
        };  
        recipes.push(newRecipe);  
        saveRecipes();  
        displayRecipes(recipes);  
        document.getElementById("recipeForm").reset();  
    });  
  
// UPDATE - EDIT RECIPE  
function editRecipe(id) {  
    const recipe = recipes.find(  
        recipe => recipe.id === id  
    );  
    if (!recipe) return;  
    const newName = prompt("Enter recipe name:",recipe.name);  
    if (newName === null) return;  
    const newCuisine = prompt("Enter cuisine:",recipe.cuisine);  
    if (newCuisine === null) return;  
    const newPrepTime = prompt("Enter time taken:",recipe.prepTime);  
    if (newPrepTime === null) {  
        return;  
    }  
    recipe.name = newName;  
    recipe.cuisine = newCuisine;  
    recipe.prepTime = newPrepTime;  
    saveRecipes();  
    displayRecipes(recipes);  
}  
  
// DELETE - DELETE RECIPE  
function deleteRecipe(id) {  
    const confirmDelete = confirm("Are you sure you want to delete this recipe?");  
    if (!confirmDelete) return;  
    recipes = recipes.filter(recipe => recipe.id !== id);  
    saveRecipes();  
    displayRecipes(recipes);  
}  
  
// SEARCH  
async function searchRecipes() {  
    const table = document.getElementById("recipeTable");  
    const searchText =document.getElementById("searchInput").value.toLowerCase().trim();  
    if (searchText === "") {  
        displayRecipes(recipes);  
        return;  
    }  
    table.innerHTML = `<tr><td colspan="5">Searching... <span class="loader"></span></td></tr>`;  
    await new Promise(resolve => setTimeout(resolve, 300));  
    const filteredRecipes = recipes.filter(recipe =>  
        recipe.name.toLowerCase().includes(searchText)  
        ||  
        recipe.cuisine.toLowerCase().includes(searchText)  
    );  
    if (filteredRecipes.length === 0) {  
        table.innerHTML = `<tr><td colspan="5">No recipes found.</td></tr>`;  
        return;  
    }  
    displayRecipes(filteredRecipes);  
}  
  
// SHOW ALL  
async function showAllRecipes() {  
    const table = document.getElementById("recipeTable");  
    table.innerHTML = `<tr><td colspan="5">Loading recipes... <span class="loader"></span></td></tr>`;  
    await new Promise(resolve => setTimeout(resolve, 300));  
    displayRecipes(recipes);  
}  
  
// SAVE TO LOCAL STORAGE  
function saveRecipes() {  
    localStorage.setItem("recipes",JSON.stringify(recipes));  
}  
  
loadRecipes();