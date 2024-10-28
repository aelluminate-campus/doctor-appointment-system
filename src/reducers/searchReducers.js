import { SEARCH_ITEMS_SUCCESS, SEARCH_ITEMS_FAIL } from '../constants/searchConstants';

const initialState = {
  doctor_results: [],
  product_results: [],
  error: null,
};

export const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_ITEMS_SUCCESS:
      return {
        ...state,
        doctor_results: action.payload.doctor_results,
        product_results: action.payload.product_results,
        error: null,
      };
    case SEARCH_ITEMS_FAIL:
      return {
        ...state,
        error: action.payload,
        doctor_results: [],
        product_results: [],
      };
    default:
      return state;
  }
};