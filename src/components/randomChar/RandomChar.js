import {Component} from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';

import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {

  state = {
    char: {},
    loading: true,
    error: false
  }

  componentDidMount() {
    this.updateChar();
  }

  marvelService = new MarvelService();

  onCharLoaded = (char) => {
    let {description, ...charProps} = char;
    description = (
      char.description.length === 0 ? 'There is no description' :
      char.description.length > 227 ? char.description.slice(0, 210).trim() + '...' : char.description
      );
    charProps.description = description;

    this.setState({
      char: charProps,
      loading: false
    })
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true
    })
  }

  updateChar = () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    this.marvelService
      .getCharacter(id)
      .then(this.onCharLoaded)
      .catch(this.onError);
  }

  onTryIt = () => {
    this.updateChar();
  }

  render() {
    const {char, loading, error} = this.state;
    
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View char={char}/> : null;

    return (
      <div className="randomchar">
        {errorMessage}
        {spinner}
        {content}
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!<br/>
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">
            Or choose another one
          </p>
          <button onClick={this.onTryIt} className="button button__main">
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
        </div>
      </div>
    )
  }
}

const View = ({char}) => {
  const {name, description, thumbnail, homepage, wiki} = char;
  let imgStyle = {'objectFit' : 'cover'};
  if (thumbnail.includes('image_not_available.jpg')) {
    imgStyle = {'objectFit' : 'contain'};
  }

  return (
    <div className="randomchar__block">
      <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
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
  )
}

export default RandomChar;