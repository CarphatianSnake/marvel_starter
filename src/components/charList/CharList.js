import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charList.scss';

class CharList extends Component {

  state = {
    chars: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charsEnded: false
  }
  
  componentDidMount() {
    this.onRequest();
    // window.addEventListener('scroll', this.onScroll, {passive: true});
  }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.onScroll);
  // }

  onScroll = () => {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      this.onRequest(this.state.offset);
    }
  }

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true
    })
  }

  marvelService = new MarvelService();

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharaters(offset)
      .then(this.onCharsLoaded)
      .catch(this.onError);
  }

  onCharsLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 9) ended = true;

    this.setState(({chars, offset}) => ({
      chars: [...chars, ...newChars],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charsEnded: ended
    }))
  }

  onError = () => {
    this.setState({
      loading: false,
      error: true
    })
  }

  itemRefs = [];

  setRef = (ref) => {
    this.itemRefs.push(ref);
  }

  onItemFocus = (i) => {
    this.itemRefs.forEach(item => {
      item.classList.remove('char__item_selected');
    })
    this.itemRefs[i].classList.add('char__item_selected');
    this.itemRefs[i].focus();
  }

  viewChar(chars) {
    const items = chars.map((item, i) => {
      let imgStyle = {'objectFit' : 'cover'};
      if (item.thumbnail.includes('image_not_available.jpg')) {
        imgStyle = {'objectFit' : 'unset'};
      }
      return (
        <li
          tabIndex="0"
          ref={this.setRef}
          className="char__item"
          key={item.id}
          onClick={() => {
            this.props.onCharSelected(item.id);
            this.onItemFocus(i);
          }}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              this.props.onCharSelected(item.id);
              this.onItemFocus(i);
            }
          }}>
          <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
          <div className="char__name">{item.name}</div>
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
    const {chars, loading, error, offset, newItemLoading, charsEnded} = this.state;
    const items = this.viewChar(chars);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;
    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          style={{'display': charsEnded ? 'none' : 'block'}}
          onClick={() => this.onRequest(offset)}>
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

CharList.propTypes = {
  onCharSelected: PropTypes.func
}

export default CharList;