import {Link} from 'react-router-dom'
import ErrorMessage from "../errorMessage/ErrorMessage";

import './404.scss';

const Page404 = () => {
  return (
    <div className="img404">
      <ErrorMessage/>
      <p className="text404">Page does not exist</p>
      <Link className="link404" to="/">Back to main page</Link>
    </div>
  )
}

export default Page404;