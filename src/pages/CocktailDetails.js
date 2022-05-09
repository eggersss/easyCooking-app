import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { requestCocktailByIDThunk, recipeThunk } from '../actions/index.actions';
import SimpleSliderRecipes from '../components/SimpleSliderRecipes';
import FavoriteBtn from '../components/FavoriteBtn';
import ShareBtn from '../components/ShareBtn';

function CocktailDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { cocktail } = useSelector((state) => state.cocktailByIDReducer);
  const { recipe } = useSelector((state) => state.recipeReducer);
  const [ingredients, setIngredients] = useState([]);
  const [drink, setDrink] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [recommendedCards, setRecommendedCards] = useState([]);
  const [currentBtn, setCurrentBtn] = useState('Start Recipe');
  const [showBtn, setShowBtn] = useState(true);

  const findButtonInLocalStorage = () => {
    const doneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));
    const isRecipeDone = doneRecipes?.some((doneRecipe) => doneRecipe.id === Number(id));
    setShowBtn(!isRecipeDone);
    const recipesInProgress = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (recipesInProgress?.cocktails[id] !== undefined) setCurrentBtn('Continue Recipe');
  };

  useEffect(() => {
    dispatch(recipeThunk({ search: '', typeInput: 'Name' }));
    dispatch(requestCocktailByIDThunk(id));
    findButtonInLocalStorage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // this hook makes the API output easier to read by returning the ingredients in the following format:
    // ingredients = ['Southern Comfort', 'Triple sec', 'Lime', 'Sour mix']
    setDrink(cocktail);
    if (cocktail.length > 0) {
      const drinkIngredients = Object.entries(cocktail[0])
        .filter((drinkIngredient) => drinkIngredient[0].includes('strIngredient'))
        .filter((drinksArray) => drinksArray[1] !== null)
        .map((ingredientBeingMapped) => ingredientBeingMapped[1]);

      const drinkMeasurements = Object.entries(cocktail[0])
        .filter((drinkMeasurement) => drinkMeasurement[0].includes('strMeasure'))
        .filter((drinksArray) => drinksArray[1] !== null)
        .map((measurementsMapped) => measurementsMapped[1]);

      setIngredients(drinkIngredients);
      setMeasurements(drinkMeasurements);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cocktail]);

  useEffect(() => {
    // const sortRandomizer = 0.5;
    const MAXIMUN_NUMBER_OF_CARDS = 6;
    if (recipe.meals?.length > 0) {
      const randomCards = [...recipe.meals];
      // .sort(() => Math.random() - sortRandomizer);
      setRecommendedCards(randomCards.slice(0, MAXIMUN_NUMBER_OF_CARDS));
    }
  }, [recipe]);

  const handleClick = () => {
    history.push(`/drinks/${id}/in-progress`);
  };

  return (
    drink.length > 0
      ? (
        <div>
          <img
            src={ cocktail[0].strDrinkThumb }
            alt="cocktail thumbnail"
            data-testid="recipe-photo"
          />
          <div>
            <h2 data-testid="recipe-title">{cocktail[0].strDrink}</h2>
            <ShareBtn />
            <FavoriteBtn
              id={ id }
              type="drink"
              nationality=""
              category={ cocktail[0].strCategory }
              name={ cocktail[0].strDrink }
              image={ cocktail[0].strDrinkThumb }
              alcoholicOrNot={ cocktail[0].strAlcoholic }
            />
            <p data-testid="recipe-category">{cocktail[0].strAlcoholic}</p>
          </div>

          <div>
            <ul>
              <h2>Ingredients</h2>
              {ingredients.map((ingredient, index) => (
                <li
                  key={ `${index}-ingredient-name-and-measure` }
                  data-testid={ `${index}-ingredient-name-and-measure` }
                >
                  {`${ingredient} ${measurements[index]}`}

                </li>
              ))}
            </ul>
            <h2>Instructions</h2>
            <p data-testid="instructions">
              {cocktail[0].strInstructions}
            </p>
          </div>
          <h2>Recommended</h2>
          <SimpleSliderRecipes
            recommendedCards={ recommendedCards }
          />
          {showBtn
            ? (
              <button
                className="recipe-button"
                type="button"
                data-testid="start-recipe-btn"
                onClick={ () => handleClick() }
              >
                {currentBtn}
              </button>)
            : ''}
        </div>
      ) : '');
}

export default CocktailDetails;
