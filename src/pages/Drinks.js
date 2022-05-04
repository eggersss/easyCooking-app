import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cards from '../components/Cards';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { cocktailThunk, cocktailCategoriesThunk,
  ingredientFilter } from '../actions/index.actions';

function Drinks() {
  const dispatch = useDispatch();
  const [clicked, setClicked] = useState({});
  const drinks = useSelector((state) => state.cocktailReducer.cocktail.drinks);
  const { filter } = useSelector((state) => state.filterReducer);

  const buttonsNames = [
    'All',
    'Ordinary Drink',
    'Cocktail',
    'Milk / Float / Shake',
    'Other/Unknown',
    'Cocoa',
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
      dispatch(cocktailThunk(objFilteredByIngredient));
    } else {
      dispatch(cocktailThunk(objToDispatch));
    }

    // dispatch(cocktailThunk(objToDispatch));
  }, [dispatch]);

  const handleClick = ({ target }) => {
    const { name } = target;

    setClicked({
      [name]: !clicked[name],
    });

    if (clicked[name] || name === 'All') {
      const objToDispatch = { search: '', typeInput: 'Name' };

      dispatch(cocktailThunk(objToDispatch));
    } else {
      dispatch(cocktailCategoriesThunk(name));
    }

    console.log(name);
  };

  const handleClickToggle = () => {
    const obj = { search: '', typeInput: 'Name' };

    dispatch(cocktailThunk(obj));
  };

  return (
    <div>
      <Header title="Drinks" visible />
      <button type="reset" onClick={ handleClickToggle }>
        Reset
      </button>
      {
        buttonsNames.map((buttonName, index) => (
          <button
            key={ index }
            data-testid={ `${buttonName}-category-filter` }
            type="button"
            name={ buttonName }
            onClick={ handleClick }
          >
            {buttonName}
          </button>
        ))
      }
      {
        drinks && drinks.map((drink, index) => {
          const maxdrinks = 11;
          if (index > maxdrinks) return;
          return (
            <Cards
              id={ drink.idDrink }
              key={ drink.strDrink }
              img={ drink.strDrinkThumb }
              index={ index }
              title={ drink.strDrink }
            />
          );
        })
      }
      <Footer />
    </div>
  );
}

export default Drinks;
