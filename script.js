let recipes = [];   
const API_URL = "http://localhost:5555/recipes";    
async function loadRecipes() {   
    const table = document.getElementById("recipeTable");   
    table.innerHTML = `<tr><td colspan="5">Loading recipes... <span class="loader"></span></td></tr>`;      
    try {   
        const response = await fetch(API_URL);   
        if (!response.ok) {   
            throw new Error("Failed to load recipes");   
        }   
        recipes = await response.json();   
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
   
// CREATE
document   
    .getElementById("recipeForm")   
    .addEventListener("submit", async function(event) {   
        event.preventDefault();   
        const name =document.getElementById("recipeName").value;   
        const cuisine =document.getElementById("cuisine").value;   
        const prepTime =document.getElementById("prepTime").value;   
        const newRecipe = {   
            name: name,   
            cuisine: cuisine,   
            prepTime: prepTime   
        };   
        try {   
            const response = await fetch(API_URL, {   
                method: "POST",   
                headers: {   
                    "Content-Type": "application/json"   
                },   
                body: JSON.stringify(newRecipe)   
            });   
            if (!response.ok) {   
                throw new Error("Failed to add recipe");   
            }   
            const addedRecipe = await response.json();   
            recipes.push(addedRecipe);   
            displayRecipes(recipes);   
            document.getElementById("recipeForm").reset();   
        } catch (error) {   
            alert("Unable to add recipe. Please try again.");   
            console.error(error);   
        }   
    });   
   
// UPDATE   
async function editRecipe(id) {   
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
    const updatedRecipe = {   
        name: newName,   
        cuisine: newCuisine,   
        prepTime: newPrepTime   
    };   
    try {   
        const response = await fetch(`${API_URL}/${id}`, {   
            method: "PATCH",   
            headers: {   
                "Content-Type": "application/json"   
            },   
            body: JSON.stringify(updatedRecipe)   
        });   
        if (!response.ok) {   
            throw new Error("Failed to update recipe");   
        }   
        const updatedData = await response.json();   
        const index = recipes.findIndex(recipe => recipe.id === id);   
        recipes[index] = updatedData;   
        displayRecipes(recipes);   
    } catch (error) {   
        alert("Unable to update recipe. Please try again.");   
        console.error(error);   
    }   
}   
   
// DELETE   
async function deleteRecipe(id) {   
    const confirmDelete = confirm("Are you sure you want to delete this recipe?");   
    if (!confirmDelete) return;   
    try {   
        const response = await fetch(`${API_URL}/${id}`, {   
            method: "DELETE"   
        });   
        if (!response.ok) {   
            throw new Error("Failed to delete recipe");   
        }   
        recipes = recipes.filter(recipe => recipe.id !== id);   
        displayRecipes(recipes);   
    } catch (error) {   
        alert("Unable to delete recipe. Please try again.");   
        console.error(error);   
    }   
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
   
    try {   
        const response = await fetch(API_URL);   
        if (!response.ok) {   
            throw new Error("Failed to search recipes");   
        }   
        const data = await response.json();   
        recipes = data;   
   
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
    } catch (error) {   
        table.innerHTML = `<tr><td colspan="5">Unable to search recipes. Please try again.</td></tr>`;   
        console.error(error);   
    }   
}   
// SHOW ALL   
async function showAllRecipes() {   
    const table = document.getElementById("recipeTable");   
    table.innerHTML = `<tr><td colspan="5">Loading recipes... <span class="loader"></span></td></tr>`;   
   
    try {   
        const response = await fetch(API_URL);   
        if (!response.ok) {   
            throw new Error("Failed to load recipes");   
        }   
        recipes = await response.json();   
        displayRecipes(recipes);   
    } catch (error) {   
        table.innerHTML = `<tr><td colspan="5">Unable to load recipes. Please try again.</td></tr>`;   
        console.error(error);   
    }   
}   
   
loadRecipes();
