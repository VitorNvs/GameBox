// src/redux/listsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/lists';

// Helper: get token from state and build headers
const authConfig = (getState) => {
  const token = getState().auth?.token;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

// Normalize server response to frontend format (jogos / jogosCount / id)
function normalizeListItem(item) {
  return {
    ...item,
    id: item.id || item._id,
    jogos: item.jogos || item.games || [],
    jogosCount: item.jogosCount ?? item.gamesCount ?? (item.jogos ? item.jogos.length : (item.games ? item.games.length : 0)),
  };
}

// FETCH LISTS
export const fetchLists = createAsyncThunk('lists/fetchLists', async (_, { rejectWithValue, getState }) => {
  try {
    const config = authConfig(getState);
    const response = await axios.get(API_URL, config);
    const data = Array.isArray(response.data) ? response.data.map(normalizeListItem) : normalizeListItem(response.data);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// CREATE LIST
export const createList = createAsyncThunk('lists/createList', async (newListData, { rejectWithValue, getState }) => {
  try {
    const config = authConfig(getState);
    // Ensure we send jogos (array of IDs) to backend
    const jogosToSend = Array.isArray(newListData.jogos) ? newListData.jogos : [];
    const payload = {
      ...newListData,
      jogos: jogosToSend,
      jogosCount: jogosToSend.length,
    };
    const response = await axios.post(API_URL, payload, config);
    return normalizeListItem(response.data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// DELETE LIST
export const deleteList = createAsyncThunk('lists/deleteList', async (listId, { rejectWithValue, getState }) => {
  try {
    const config = authConfig(getState);
    await axios.delete(`${API_URL}/${listId}`, config);
    return listId;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// UPDATE DETAILS (title/description)
export const updateListDetails = createAsyncThunk(
  'lists/updateListDetails',
  async ({ id, title, description, jogos }, { rejectWithValue, getState }) => {
    try {
      const config = authConfig(getState);

      const response = await axios.patch(
        `${API_URL}/${id}`,
        { title, description, jogos }, // ✅ agora jogos existe
        config
      );

      return normalizeListItem(response.data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// UPDATE JOGOS (adicionar / remover) - updatedJogos is array of IDs
export const updateListGames = createAsyncThunk('lists/updateListGames', async ({ listId, updatedJogos }, { rejectWithValue, getState }) => {
  try {
    const config = authConfig(getState);
    const response = await axios.patch(`${API_URL}/${listId}`, { jogos: updatedJogos, jogosCount: updatedJogos.length }, config);
    return normalizeListItem(response.data);
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const listsSlice = createSlice({
  name: 'lists',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createList.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteList.fulfilled, (state, action) => {
        state.items = state.items.filter(list => list.id !== action.payload);
      })
      .addCase(updateListDetails.fulfilled, (state, action) => {
        const idx = state.items.findIndex(l => l.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateListGames.fulfilled, (state, action) => {
        const idx = state.items.findIndex(l => l.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      });
  },
});

export default listsSlice.reducer;
