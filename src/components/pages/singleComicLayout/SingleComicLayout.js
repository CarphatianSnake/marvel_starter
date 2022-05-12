import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Link } from "react-router-dom";

import './singleComicLayout.scss';

const SingleComicLayout = ({data}) => {
  const {thumbnail, name, description, pageCount, language, price} = data;
  
  return (
    <TransitionGroup component={null}>
      <CSSTransition appear={true} timeout={500} classNames="single-comic">
        <div className="single-comic">
          <img src={thumbnail} alt={name} className="single-comic__img"/>
          <div className="single-comic__info">
            <h2 className="single-comic__name">{name}</h2>
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

export default SingleComicLayout;