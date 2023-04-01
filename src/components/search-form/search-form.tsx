import { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import Search from './search.svg';

import './search-form.scss';

function SearchForm() {
  const [handle, setHandle] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setHandle(searchParams.get('handle') ?? '');
  }, [searchParams]);

  const handleChangeHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(event.target.value);
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    searchParams.set('handle', handle);
    navigate('/search?' + searchParams.toString());
  };

  return (
    <div className="form-container">
      <form className="search-form" method="GET" action="/search" onSubmit={handleSubmit}>
        <div className="wrapper">
          <button className="image-container" type="submit">
            <img src={Search} alt="search" />
          </button>
          <input
            type="text"
            name="handle"
            value={handle}
            placeholder="Search for gists by Github username..."
            onChange={handleChangeHandle}
          />
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
