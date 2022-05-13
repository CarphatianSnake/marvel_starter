import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

import './charSearchForm.scss';

const setContent = (process, data) => {
  switch (process) {
    case 'waiting':
      return null;
    case 'loading': 
      return <Spinner/>;
    case 'confirmed':
      return (
        !data ? null : data.length > 0 ?
        <div className="char__search-wrapper">
          <div className="char__search-success">There is! Visit {data[0].name} page?</div>
          <Link to={`/characters/${data[0].id}`} className="button button__secondary">
            <div className="inner">To page</div>
          </Link>
        </div> :
        <div className="char__search-error">
          The character not found. Check name and try again!
        </div>
      );
    case 'error':
      return <div className="char__search-critical-error"><ErrorMessage/></div>;
    default:
      throw new Error('Unexpected process state');
  }
}

const CharSearchForm = () => {

  const [char, setChar] = useState(null);

  const {getCharacterByName, clearError, process, setProcess} = useMarvelService();

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const updateChar = (name) => {
    clearError();

    getCharacterByName(name)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed'));
  };

  return (
    <div className='char__search-form'>
      <Formik 
        initialValues={{
          charName: ''
        }}
        validationSchema= {Yup.object({
          charName: Yup.string().required('This field is required')
        })}
        onSubmit={({charName}) => {
          updateChar(charName);
        }}
      >
        <Form>
          <label className="char__search-label" htmlFor="charName">Or find a character by name:</label>
          <div className="char__search-wrapper">
            <Field id="charName" name="charName" type="text" placeholder="Enter name"/>
            <button type="submit" className="button button__main" disabled={process === 'loading'}>
              <div className="inner">find</div>
            </button>
          </div>
          <FormikErrorMessage name="charName" className="char__search-error" component="div"/>
        </Form>
      </Formik>
      {setContent(process, char)}
    </div>
  )
}

export default CharSearchForm;