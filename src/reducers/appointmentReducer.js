import {
    APPOINTMENT_CREATE_REQUEST,
    APPOINTMENT_CREATE_SUCCESS,
    APPOINTMENT_CREATE_FAIL,
    APPOINTMENT_LIST_REQUEST,
    APPOINTMENT_LIST_SUCCESS,
    APPOINTMENT_LIST_FAIL,
    USER_APPOINTMENT_RESET,
    APPOINTMENT_UPDATE_REQUEST, 
    APPOINTMENT_UPDATE_SUCCESS, 
    APPOINTMENT_UPDATE_FAIL,
    APPOINTMENT_DETAILS_REQUEST,
    APPOINTMENT_DETAILS_FAIL,
    APPOINTMENT_DETAILS_SUCCESS,

    APPOINTMENT_PAY_REQUEST,
    APPOINTMENT_PAY_FAIL,
    APPOINTMENT_PAY_SUCCESS,
    APPOINTMENT_PAY_RESET,

    APPOINTMENT_REVIEW_REQUEST,
    APPOINTMENT_REVIEW_FAIL,
    APPOINTMENT_REVIEW_SUCCESS,

    SAVE_ELAPSED_TIME,
} from '../constants/appointmentConstants';

import { USER_LOGOUT } from '../constants/userConstants';
const initialState = {
    appointment: [],
    loading: false,
    error: null,
};

export const appointmentReducer = (state = initialState, action) => {
    switch (action.type) {
      case SAVE_ELAPSED_TIME:
        return {
          ...state,
          appointment: state.appointment.map(appointment =>
            appointment.id === action.payload.appointmentId
              ? { ...appointment, elapsedTime: action.payload.elapsedTime }
              : appointment
          ),
        };
      // Other cases...
      default:
        return state;
    }
  };

export const appointmentCreateReducer = (state = initialState, action) => {
    switch (action.type) {
        case APPOINTMENT_CREATE_REQUEST:
            return { loading: true };
        case APPOINTMENT_CREATE_SUCCESS:
            return { loading: false, appointment: action.payload, error: null };
        case APPOINTMENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const appointmentListReducer = (state = initialState, action) => {
    switch (action.type) {
        case APPOINTMENT_LIST_REQUEST:
            return { ...state, loading: true };
        case APPOINTMENT_LIST_SUCCESS:
            return { loading: false, appointments: action.payload };
        case APPOINTMENT_LIST_FAIL:
            return { loading: false, error: action.payload };
        case USER_APPOINTMENT_RESET:
            return initialState;

        case APPOINTMENT_UPDATE_REQUEST:
            return { ...state, loading: true };
        case APPOINTMENT_UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                appointments: state.appointments.map((appointment) => 
                appointment.id === action.payload.id ? action.payload : appointment
                ),
            };
        case APPOINTMENT_UPDATE_FAIL:
            return { ...state, loading: false, error: action.payload };
        case USER_LOGOUT:
            return initialState;
        default:
            return state;
    }
};


export const appointmentDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case APPOINTMENT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true
            }

        case APPOINTMENT_DETAILS_SUCCESS:
            return {
                loading: false,
                appointment: action.payload
            }

        case APPOINTMENT_DETAILS_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}


export const appointmentPayReducer = (state = initialState, action) => {
    switch (action.type) {
        case APPOINTMENT_PAY_REQUEST:
            return {
                loading: true
            }

        case APPOINTMENT_PAY_SUCCESS:
            return {
                loading: false,
                success: true
            }

        case APPOINTMENT_PAY_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        case APPOINTMENT_PAY_RESET:
            return {}

        default:
            return state
    }
}

export const appointmentReviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case APPOINTMENT_REVIEW_REQUEST:
            return {
                loading: true
            }

        case APPOINTMENT_REVIEW_SUCCESS:
            return {
                loading: false,
                success: true
            }

        case APPOINTMENT_REVIEW_FAIL:
            return {
                loading: false,
                error: action.payload
            }

        default:
            return state
    }
}
