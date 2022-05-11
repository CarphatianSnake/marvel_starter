import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useMarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './comicsList.scss';

const ComicsList = () => {
  const [comics, setComics] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [comicsEnded, setComicsEnded] = useState(false);

  const {loading, error, getAllComics} = useMarvelService();

  useEffect(() => {
    onRequest(offset, true)
    // eslint-disable-next-line
  }, [])

  const onRequest = (offset, initial) => {
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
      .then(onComicsLoaded);
  }

  const onComicsLoaded = (newComics) => {
    let ended = false;
    if (newComics.length < 8) ended = true;

    setComics(comics => [...comics, ...newComics]);
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setComicsEnded(ended);
  }

  function viewComics(comics) {
    const items = comics.map((item, i) => {
      
      return (
        <CSSTransition key={i} classNames="comics__item" timeout={500}>
          <li 
            className="comics__item"
            tabIndex="0">
            <Link to={`/comics/${item.id}`}>
              <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
              <div className="comics__item-name">{item.title}</div>
              <div className="comics__item-price">{item.price}</div>
            </Link>
          </li>
        </CSSTransition>
      )
    })

    return (
      <ul className="comics__grid">
        <TransitionGroup component={null}>
          {items}
        </TransitionGroup>
      </ul>
    )
  }

  const items = viewComics(comics);
  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner/> : null;

  return (
    <div className="comics__list">
      {items}
      {errorMessage}
      {spinner}
      <button 
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{'display': comicsEnded ? 'none' : 'block'}}
        onClick={() => onRequest(offset)}>
          <div className="inner">load more</div>
      </button>
    </div>
  )
}

ComicsList.propTypes = {
  onComicsSelected: PropTypes.func
}

export default ComicsList;