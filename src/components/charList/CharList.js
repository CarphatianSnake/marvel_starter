import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {

  state = {
    chars: [],
    loading: true,
    error: false
  }
  
  componentDidMount() {
    this.updateCharsList();
  }

  marvelService = new MarvelService();

  onCharsLoaded = (chars) => {
    this.setState({
      chars: chars,
      loading: false
    })
  }

  updateCharsList = () => {
    this.marvelService
      .getAllCharaters()
      .then(this.onCharsLoaded)
      .catch(this.onError);
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true
    })
  }

  viewChar(chars) {
    const items = chars.map(item => {
      const {name, thumbnail, id} = item;
      let imgStyle = {'objectFit' : 'cover'};
      if (thumbnail.includes('image_not_available.jpg')) {
        imgStyle = {'objectFit' : 'unset'};
      }
      return (
        <li className="char__item" key={id} onClick={() => this.props.onCharSelected(id)}>
          <img src={thumbnail} alt={name} style={imgStyle}/>
          <div className="char__name">{name}</div>
        </li>
      )
    })

    return (
      <ul className="char__grid">
        {items}
      </ul>
    )
  }

  render() {
    const {chars, loading, error} = this.state;
    const items = this.viewChar(chars);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;
    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

// const ViewChar = ({chars}) => {
//   return (
//     chars.map(item => {
//       const {name, thumbnail, id} = item;
//       let imgStyle = {'objectFit' : 'cover'};
//       if (thumbnail.includes('image_not_available.jpg')) {
//         imgStyle = {'objectFit' : 'contain'};
//       }
//       return (
//         <li className="char__item" key={id} onClick={() => this.props.onCharSelected(id)}>
//           <img src={thumbnail} alt={name} style={imgStyle}/>
//           <div className="char__name">{name}</div>
//         </li>
//       )
//     })
//   )
// }

export default CharList;