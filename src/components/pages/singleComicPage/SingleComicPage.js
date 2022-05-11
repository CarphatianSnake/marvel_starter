import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../../services/MarvelService';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import Spinner from '../../spinner/Spinner';

import './singleComicPage.scss';

const SingleComicPage = () => {
  const {comicId} = useParams();
  const [comic, setComic] = useState(null);

  const {loading, error, getComic, clearError} = useMarvelService();

  useEffect(() => {
    updateComic();
  }, [comicId])

  const updateComic = () => {
    clearError();
    getComic(comicId)
      .then(onComicLoaded);
  }

  const onComicLoaded = (comic) => {
    setComic(comic);
  }

  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading ? <Spinner/> : null;
  const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  )
}

const View = ({comic}) => {
  const {thumbnail, title, description, pageCount, language, price} = comic;
  
  return (
    <TransitionGroup component={null}>
      <CSSTransition appear={true} timeout={500} classNames="single-comic">
        <div className="single-comic">
          <img src={thumbnail} alt={title} className="single-comic__img"/>
          <div className="single-comic__info">
            <h2 className="single-comic__name">{title}</h2>
            <p className="single-comic__descr">{description ? description : 'There is no description'}</p>
            <p className="single-comic__descr">{pageCount ? pageCount + ' pages' : null}</p>
            <p className="single-comic__descr">Language: {language}</p>
            <div className="single-comic__price">{price}</div>
          </div>
          <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default SingleComicPage;