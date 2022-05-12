import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import '../charInfo.scss';

function ViewChar({char}) {
  const {name, description, thumbnail, homepage, wiki, comics} = char;
  let imgStyle = {'objectFit' : 'cover'};
  if (thumbnail.includes('image_not_available.jpg')) {
    imgStyle = {'objectFit' : 'unset'};
  }

  const comicsList = () => {
    if (comics.length < 1) return 'There is no comics for this character!'
    else {
      return (
        comics.slice(0, 10).map((item, i) => {
          return <Link
          to={`comics/${item.resourceURI.replace('http://gateway.marvel.com/v1/public/comics/', '')}`}
          key={i}
          className="char__comics-item">
            {item.name}
          </Link>;    
        })
      )
    }
  }

  return (
    <TransitionGroup component={null}>
      <CSSTransition appear={true} timeout={500} classNames="char">
        <div className="char">
          <div className="char__basics">
            <img src={thumbnail} alt={name} style={imgStyle}/>
            <div>
              <div className="char__info-name">{name}</div>
              <div className="char__btns">
                <a href={homepage} className="button button__main">
                  <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
                  <div className="inner">Wiki</div>
                </a>
              </div>
            </div>
          </div>
          <div className="char__descr">
            {description}
          </div>
          <div className="char__comics">Comics:</div>
          <ul className="char__comics-list">
            {comicsList()}
          </ul>
        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default ViewChar;