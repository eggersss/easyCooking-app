import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { recipeThunk, recipeCategoriesThunk,
  ingredientFilter } from '../actions/index.actions';

function Foods() {
  const dispatch = useDispatch();
  const [clicked, setClicked] = useState({});
  // const [disabled, setDisabled] = useState(false);
  const foods = useSelector((state) => state.recipeReducer.recipe.meals);
  const { filter } = useSelector((state) => state.filterReducer);

  const buttonsNames = [
    'All',
    'Beef',
    'Breakfast',
    'Chicken',
    'Dessert',
    'Goat',
  ];

  useEffect(() => {
    console.log(filter);
    return () => {
      dispatch(ingredientFilter(''));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const objToDispatch = { search: '', typeInput: 'Name' };
    const objFilteredByIngredient = { search: filter, typeInput: 'Ingredient' };

    if (filter) {
      dispatch(recipeThunk(objFilteredByIngredient));
    } else {
      dispatch(recipeThunk(objToDispatch));
    }
    // dispatch(recipeThunk(objToDispatch));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = ({ target }) => {
    const { name } = target;

    setClicked({
      [name]: !clicked[name],
    });

    if (clicked[name] || name === 'All') {
      const objToDispatch = { search: '', typeInput: 'Name' };

      dispatch(recipeThunk(objToDispatch));
    } else {
      dispatch(recipeCategoriesThunk(name));
    }
  };

  const handleClickToggle = () => {
    const obj = { search: '', typeInput: 'Name' };

    dispatch(recipeThunk(obj));
  };

  return (
    <div>
      <Header title="Foods" visible />
      <button type="reset" onClick={ handleClickToggle }>
        Reset
      </button>
      {
        buttonsNames.map((buttonName, index) => (
          <button
            key={ index }
            type="button"
            data-testid={ `${buttonName}-category-filter` }
            name={ buttonName }
            onClick={ handleClick }
          >
            {buttonName}
          </button>
        ))
      }
      {
        foods && foods
          .map((meal, index) => {
            const maxFoods = 11;
            if (index > maxFoods) return;
            console.log(meal);
            return (
              <Cards
                key={ index }
                id={ meal.idMeal }
                img={ meal.strMealThumb }
                index={ index }
                title={ meal.strMeal }
              />
            );
          })
      }
      <Footer />
    </div>
  );
}

export default Foods;
