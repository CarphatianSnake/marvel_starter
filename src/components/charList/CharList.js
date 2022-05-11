import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';
import '../../style/transition.scss';

const CharList = (props) => {

  const [chars, setChars] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charsEnded, setCharsEnded] = useState(false);

  const {loading, error, getAllCharaters} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true)
    // eslint-disable-next-line
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
    setNewItemLoading(newItemLoading >= true);
    setOffset(offset => offset + 9);
    setCharsEnded(charsEnded => ended);
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
      if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = {'objectFit' : 'unset'};
      }
      return (
        <CSSTransition key={item.id} timeout={500} classNames="transition">
            <li
              tabIndex={0}
              ref={(e) => itemRefs.current[i] = e}
              className="char__item"
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
        </CSSTransition>
      )
    });

    return (
      <ul className="char__grid">
        <TransitionGroup component={null}>
          {items}
        </TransitionGroup>
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