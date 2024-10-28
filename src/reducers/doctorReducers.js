import {
    DOCTOR_LIST_REQUEST,
    DOCTOR_LIST_SUCCESS,
    DOCTOR_LIST_FAIL,
    DOCTOR_DETAIL_REQUEST,
    DOCTOR_DETAIL_SUCCESS,
    DOCTOR_DETAIL_FAIL,
    DOCTOR_CREATE_REQUEST,
    DOCTOR_CREATE_SUCCESS,
    DOCTOR_CREATE_FAIL,
    DOCTOR_UPDATE_REQUEST,
    DOCTOR_UPDATE_SUCCESS,
    DOCTOR_UPDATE_FAIL,
    DOCTOR_DELETE_REQUEST,
    DOCTOR_DELETE_SUCCESS,
    DOCTOR_DELETE_FAIL,
    DOCTOR_CREATE_REVIEW_REQUEST,
    DOCTOR_CREATE_REVIEW_SUCCESS,
    DOCTOR_CREATE_REVIEW_FAIL,
    DOCTOR_CREATE_REVIEW_RESET,
    DOCTOR_REVIEWS_REQUEST,
    DOCTOR_REVIEWS_SUCCESS,
    DOCTOR_REVIEWS_FAIL,
} from '../constants/doctorConstants';

import { USER_LOGOUT } from '../constants/userConstants';
const initialState = {
    doctors: [],
    loading: false,
    error: null,
};

export const doctorListReducer = (state = initialState, action) => {
    switch (action.type) {
        case DOCTOR_LIST_REQUEST:
            return { loading: true };
        case DOCTOR_LIST_SUCCESS:
            return { loading: false, doctors: action.payload };
        case DOCTOR_LIST_FAIL:
            return { loading: false, error: action.payload };
        case USER_LOGOUT:
            return initialState
        default:
            return state;
    }
};

export const doctorDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case DOCTOR_DETAIL_REQUEST:
            return { loading: true };
        case DOCTOR_DETAIL_SUCCESS:
            return { loading: false, doctor: action.payload };
        case DOCTOR_DETAIL_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const doctorCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case DOCTOR_CREATE_REQUEST:
            return { loading: true };
        case DOCTOR_CREATE_SUCCESS:
            return { loading: false, success: true };
        case DOCTOR_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const doctorUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case DOCTOR_UPDATE_REQUEST:
            return { loading: true };
        case DOCTOR_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case DOCTOR_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const doctorDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case DOCTOR_DELETE_REQUEST:
            return { loading: true };
        case DOCTOR_DELETE_SUCCESS:
            return { loading: false, success: true };
        case DOCTOR_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const doctorReviewCreateReducer = (state = initialState, action) => {
    switch (action.type) {
      case DOCTOR_CREATE_REVIEW_REQUEST:
        return {
          loading: true,
        };
  
      case DOCTOR_CREATE_REVIEW_SUCCESS:
        return {
          loading: false,
          success: true,
        };
  
      case DOCTOR_CREATE_REVIEW_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
  
      case DOCTOR_CREATE_REVIEW_RESET:
        return {};
  
      default:
        return state;
    }
  };

  export const doctorReviewsReducer = (state = initialState, action) => {
    switch (action.type) {
      case DOCTOR_REVIEWS_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case DOCTOR_REVIEWS_SUCCESS:
        return {
          ...state,
          loading: false,
          reviews: action.payload,
        };
      case DOCTOR_REVIEWS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };