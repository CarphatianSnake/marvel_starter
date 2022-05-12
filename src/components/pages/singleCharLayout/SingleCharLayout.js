import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Link } from "react-router-dom";

import './singleCharLayout.scss';

const SingleCharLayout = ({data}) => {
  const {thumbnail, name, description} = data;
  
  return (
    <TransitionGroup component={null}>
      <CSSTransition appear={true} timeout={500} classNames="single-char">
        <div className="single-char">
          <img src={thumbnail} alt={name} className="single-char__img"/>
          <div className="single-char__info">
            <h2 className="single-char__name">{name}</h2>
            <p className="single-char__descr">{description ? description : 'There is no description'}</p>
          </div>
          <Link to="/" className="single-char__back">Back to main page</Link>
        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}

export default SingleCharLayout;