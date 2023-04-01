import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { fetchGistsCount, searchGists } from './search-api';

export type Fork = {
  avatar: string;
  link: string;
};

export type Gist = {
  id: string;
  description: string | null;
  tags: string[];
  link: string;
  forks: Fork[];
};

export interface SearchState {
  total: number;
  result: Gist[];
  status: 'idle' | 'loading' | 'failed';
  totalStatus: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: SearchState = {
  total: 0,
  result: [],
  status: 'idle',
  totalStatus: 'idle',
  error: null,
};

export const searchAsync = createAsyncThunk(
  'search/search',
  async ({
    query,
    page = 1,
    perPage = 10,
  }: {
    query: string;
    page: number;
    perPage: number;
  }, { rejectWithValue }) => {
    try {
      return await searchGists({ username: query, page, perPage });
    } catch(err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchGistsCountAsync = createAsyncThunk(
  'search/gists_count',
  async (query: string, { rejectWithValue }) => {
    try {
      return await fetchGistsCount({ username: query });
    } catch(err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const SearchSlice = createSlice({
  name: 'Search',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(searchAsync.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.result = action.payload;
        state.error = null;
      })
      .addCase(searchAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.total = 0;
        state.result = [];
        state.error = action.payload as string;
      })
      .addCase(fetchGistsCountAsync.pending, state => {
        state.totalStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchGistsCountAsync.fulfilled, (state, action) => {
        state.totalStatus = 'idle';
        state.total = action.payload;
        state.error = null;
      })
      .addCase(fetchGistsCountAsync.rejected, (state, action) => {
        state.totalStatus = 'failed';
        state.total = 0;
        state.result = [];
        state.error = action.payload as string;
      });
  },
});

export const selectSearchResult = (state: RootState) => state.search.result;
export const selectSearchLoading = (state: RootState) =>
  state.search.status === 'loading' || state.search.totalStatus === 'loading';
export const selectSearchFailed = (state: RootState) => state.search.status === 'failed';
export const selectSearchError = (state: RootState) => state.search.error;
export const selectSearchTotal = (state: RootState) => state.search.total;
export const selectSearchPageCount = (perPage: number) => (state: RootState) =>
  Math.ceil(state.search.total / perPage);

export default SearchSlice.reducer;
