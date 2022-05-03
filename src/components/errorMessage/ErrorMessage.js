import errorImg from './error.gif';
import './errorMessage.scss';

const ErrorMessage = () => {
  return (
    <img alt="Error" className="error" src={errorImg}/>
  )
}

export default ErrorMessage;