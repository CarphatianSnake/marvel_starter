import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

const CharList = (props) => {

  const [chars, setChars] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charsEnded, setCharsEnded] = useState(false);

  const {loading, error, getAllCharaters} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true)
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharaters(offset)
      .then(onCharsLoaded);
  }

  const onCharsLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 9) ended = true;

    setChars(chars => [...chars, ...newChars]);
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setCharsEnded(ended);
  }

  const itemRefs = useRef([]);

  const onItemFocus = (i) => {
    itemRefs.current.forEach(item => {
      item.classList.remove('char__item_selected');
    })
    itemRefs.current[i].classList.add('char__item_selected');
    itemRefs.current[i].focus();
  }

  function viewChar(chars) {
    const items = chars.map((item, i) => {
      let imgStyle = {'objectFit' : 'cover'};
      if (item.thumbnail.includes('image_not_available.jpg')) {
        imgStyle = {'objectFit' : 'unset'};
      }
      return (
        <li
          tabIndex="0"
          ref={(e) => itemRefs.current[i] = e}
          className="char__item"
          key={item.id}
          onClick={() => {
            props.onCharSelected(item.id);
            onItemFocus(i);
          }}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              props.onCharSelected(item.id);
              onItemFocus(i);
            }
          }}>
          <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
          <div className="char__name">{item.name}</div>
        </li>
      )
    })

    return (
      <ul className="char__grid">
        {items}
      </ul>
    )
  }

  const items = viewChar(chars);
  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner/> : null;
  
  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {items}
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{'display': charsEnded ? 'none' : 'block'}}
        onClick={() => onRequest(offset)}>
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

CharList.propTypes = {
  onCharSelected: PropTypes.func.isRequired
}

export default CharList;