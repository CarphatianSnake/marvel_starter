import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarvelService from '../../../services/MarvelService';
import ErrorMessage from '../../errorMessage/ErrorMessage';
import Spinner from '../../spinner/Spinner';

import './singleCharPage.scss';

const SingleCharPage = () => {
  const {charId} = useParams();
  const [char, setChar] = useState(null);

  const {loading, error, getCharacter, clearError} = useMarvelService();

  useEffect(() => {
    updateChar();
    // eslint-disable-next-line
  }, [charId])

  const updateChar = () => {
    clearError();
    getCharacter(charId)
      .then(onCharLoaded);
  }

  const onCharLoaded = (char) => {
    setChar(char);
  }

  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading ? <Spinner/> : null;
  const content = !(loading || error || !char) ? <View char={char}/> : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  )
}

const View = ({char}) => {
  const {thumbnail, name, description} = char;
  
  return (
    <TransitionGroup component={null}>
      <CSSTransition appear={true} timeout={500} classNames="single-char">
        <div className="single-char">
          <img src={thumbnail} alt={name} className="single-char__img"/>
          <div className="single-char__info">
            <h2 className="single-char__name">{name}</h2>
            <p className="single-char__descr">{description ? description : 'There is no description'}</p>
          </div>
          <Link to="/" className="single-char__back">Back to all</Link>
        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default SingleCharPage;