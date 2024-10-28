import axiosInstance from '../actions/axiosInstance';
import { SEARCH_ITEMS_SUCCESS, SEARCH_ITEMS_FAIL } from "../constants/searchConstants";

export const searchItems = (query) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get(`/api/search?q=${query}`);
    dispatch({ type: SEARCH_ITEMS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEARCH_ITEMS_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};
