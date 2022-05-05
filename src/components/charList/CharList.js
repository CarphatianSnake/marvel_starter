import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

const CharList = (props) => {

  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charsEnded, setCharsEnded] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    onRequest()
  }, [])

  const onRequest = (offset) => {
    onCharListLoading();
    marvelService
      .getAllCharaters(offset)
      .then(onCharsLoaded)
      .catch(onError);
  }

  const onCharListLoading = () => {
    setNewItemLoading(true);
  }

  const onCharsLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 9) ended = true;

    setChars(chars => [...chars, ...newChars]);
    setLoading(false);
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setCharsEnded(ended);
  }

  const onError = () => {
    setLoading(false);
    setError(true);
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
  const spinner = loading ? <Spinner/> : null;
  const content = !(loading || error) ? items : null;
  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      {content}
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