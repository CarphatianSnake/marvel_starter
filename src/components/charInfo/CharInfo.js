import { useState, useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import setContent from '../../utils/setContent';
import ViewChar from './viewChar/ViewChar';

import './charInfo.scss';

const CharInfo = (props) => {
  const [char, setChar] = useState(null);

  const {getCharacter, clearError, process, setProcess} = useMarvelService();

  useEffect(() => {
    updateChar();
    // eslint-disable-next-line
  }, [props.charId])

  const updateChar = () => {
    const {charId} = props;
    if (!charId) return;
    
    clearError();
    getCharacter(charId)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed'));
  }

  const onCharLoaded = (char) => {
    setChar(char);
  }

  return (
    <div className="char__info">
      <Suspense fallback={<Spinner/>}>
        {setContent(process, ViewChar, char)}
      </Suspense>
    </div>
  )
}

CharInfo.propTypes = {
  charId: PropTypes.number
}

export default CharInfo;