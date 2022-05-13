import {useState, useEffect} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

  const [char, setChar] = useState([]);

  const {getCharacter, clearError, process, setProcess} = useMarvelService();

  useEffect(() => {
    updateChar();
    const timerId = setInterval(updateChar, 30000);

    return () => clearInterval(timerId);
    // eslint-disable-next-line
  }, [])

  const updateChar = () => {
    clearError();
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    getCharacter(id)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed'));
  }

  const onCharLoaded = (char) => {
    let {description, ...charProps} = char;
    description = (
      char.description.length === 0 ? 'There is no description' :
      char.description.length > 227 ? char.description.slice(0, 210).trim() + '...' : char.description
      );
    charProps.description = description;
    
    setChar(charProps);
  }

  const onTryIt = () => {
    updateChar();
  }

  return (
    <div className="randomchar">
      {setContent(process, View, char)}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!<br/>
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">
          Or choose another one
        </p>
        <button onClick={onTryIt} className="button button__main">
          <div className="inner">try it</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
      </div>
    </div>
  )
}

const View = ({data}) => {
  const {name, description, thumbnail, homepage, wiki} = data;
  let imgStyle = {'objectFit' : 'cover'};
  if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
    imgStyle = {'objectFit' : 'unset'};
  }

  return (
    <TransitionGroup component={null}>
      <CSSTransition appear={true} timeout={500} classNames="randomchar__block">
        <div className="randomchar__block">
          <img src={thumbnail} alt={name} className="randomchar__img" style={imgStyle}/>
          <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">{description}</p>
            <div className="randomchar__btns">
              <a href={homepage} className="button button__main">
                <div className="inner">homepage</div>
              </a>
              <a href={wiki} className="button button__secondary">
                <div className="inner">Wiki</div>
              </a>
            </div>
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default RandomChar;