import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Button from "../../components/button/button";
import Pagination from "../../components/pagination/pagination";
import Spinner from "../../components/spinner/spinner";
import Table from "../../components/table/table";
import {
  fetchGistsCountAsync,
  searchAsync,
  selectSearchLoading,
  selectSearchPageCount,
  selectSearchResult,
  selectSearchTotal,
  selectSearchError,
} from "./search-reducer";
import { notify } from "../../components/notification/notification-reducer";

import "./search.scss";

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("handle") || "";
  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("height")) || 10;
  const dispatch = useAppDispatch();
  const gists = useAppSelector(selectSearchResult);
  const loading = useAppSelector(selectSearchLoading);
  const total = useAppSelector(selectSearchTotal);
  const error = useAppSelector(selectSearchError);
  const pageCount = useAppSelector(selectSearchPageCount(perPage));

  useEffect(() => {
    dispatch(searchAsync({ query, page, perPage }));
  }, [dispatch, query, page, perPage]);

  useEffect(() => {
    dispatch(fetchGistsCountAsync(query));
  }, [dispatch, query]);

  useEffect(() => {
    if (error) {
      dispatch(notify({ title: "Error", description: error }));
    }
  }, [error, dispatch]);

  const handleChangePage = (page: number) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: page.toString(),
    });
  };
  return (
    <section className="container page-container page-search">
      <Spinner visible={loading} />

      <header className="page-header">
        <p>
          {total} {total === 1 ? "result" : "results"}
        </p>

        <Pagination
          total={pageCount}
          page={page}
          onChangePage={handleChangePage}
          buttonAs={Button}
        />
      </header>

      <Table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Link</th>
            <th>Forks</th>
          </tr>
        </thead>
        <tbody>
          {gists && gists.length > 0 ? (
            gists.map((gist) => (
              <tr key={gist.id}>
                <td>{gist.description}</td>
                <td>
                  <a href={gist.link}>{gist.link}</a>
                </td>
                <td>
                  <div className="table-forks-wrapper">
                    {gist.forks.map((fork, index) => (
                      <a key={index} href={fork.link}>
                        <img
                          src={fork.avatar}
                          alt={fork.link}
                          width={50}
                          height={50}
                        />
                      </a>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No results</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination
        total={pageCount}
        page={page}
        onChangePage={handleChangePage}
        buttonAs={Button}
      />
    </section>
  );
}

export default Search;
