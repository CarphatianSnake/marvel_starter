import { useState, useEffect, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const ErrorMessage = lazy(() => import('../errorMessage/ErrorMessage'));
const ViewChar = lazy(() => import('./viewChar/ViewChar'));

const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const {loading, error, getCharacter, clearError} = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId])

  const updateChar = () => {
    const {charId} = props;
    if (!charId) return;
    
    clearError();
    getCharacter(charId)
      .then(onCharLoaded);
  }

  const onCharLoaded = (char) => {
    setChar(char);
  }

  const chooseCharMsg = char || loading || error ? null : <p className="char__select">Please select a character to see information</p>;
  const errorMessage = error ? <ErrorMessage/> : null;
  const skeleton = loading ? <Skeleton/> : null;
  const content = !(loading || error || !char) ? <ViewChar char={char}/> : null;

  return (
    <div className="char__info">
    <Suspense fallback={<Spinner/>}>
      {chooseCharMsg}
      {errorMessage}
      {skeleton}
      {content}
    </Suspense>
    </div>
  )
}

CharInfo.propTypes = {
  charId: PropTypes.number
}

export default CharInfo;