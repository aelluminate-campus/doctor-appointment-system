import axiosInstance from '../actions/axiosInstance';
import {
  APPOINTMENT_CREATE_REQUEST,
  APPOINTMENT_CREATE_SUCCESS,
  APPOINTMENT_CREATE_FAIL,
  APPOINTMENT_LIST_REQUEST,
  APPOINTMENT_LIST_SUCCESS,
  APPOINTMENT_LIST_FAIL,
  APPOINTMENT_UPDATE_REQUEST, 
  APPOINTMENT_UPDATE_SUCCESS, 
  APPOINTMENT_UPDATE_FAIL,
  APPOINTMENT_DETAILS_REQUEST,
  APPOINTMENT_DETAILS_FAIL,
  APPOINTMENT_DETAILS_SUCCESS,

  APPOINTMENT_PAY_REQUEST,
  APPOINTMENT_PAY_FAIL,
  APPOINTMENT_PAY_SUCCESS,

  APPOINTMENT_REVIEW_REQUEST,
  APPOINTMENT_REVIEW_FAIL,
  APPOINTMENT_REVIEW_SUCCESS,
  SAVE_ELAPSED_TIME,
} from '../constants/appointmentConstants';

export const saveElapsedTime = (appointmentId, elapsedTime) => ({
  type: SAVE_ELAPSED_TIME,
  payload: { appointmentId, elapsedTime },
});

export const createAppointment = (appointmentData) => async (dispatch, getState) => {
  try {
    dispatch({ type: APPOINTMENT_CREATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axiosInstance.post(
      '/api/appointments/create/', 
      JSON.stringify(appointmentData), 
      config
    );

    dispatch({
      type: APPOINTMENT_CREATE_SUCCESS,
      payload: data,
    });

    return data;
  } catch (error) {
    dispatch({
      type: APPOINTMENT_CREATE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
    throw error;
  }
};

export const listUserAppointments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: APPOINTMENT_LIST_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axiosInstance.get('/api/appointments/', config);

    dispatch({
      type: APPOINTMENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: APPOINTMENT_LIST_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const getAppointmentDetails = (id) => async (dispatch, getState) => {
  try {
      dispatch({ type: APPOINTMENT_DETAILS_REQUEST });

      const { userLogin: { userInfo } } = getState();


      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.access}`,
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axiosInstance.get(`/api/appointments/${id}/`, config);

      dispatch({ type: APPOINTMENT_DETAILS_SUCCESS, payload: data });

  } catch (error) {
      dispatch({
          type: APPOINTMENT_DETAILS_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
};

export const payAppointment = (id, paymentResult) => async (dispatch) => {
  try {
      dispatch({ type: APPOINTMENT_PAY_REQUEST });

      const { data } = await axiosInstance.put(
          `/api/appointments/${id}/pay/`,
          paymentResult
      );

      dispatch({ type: APPOINTMENT_PAY_SUCCESS, payload: data });
  } catch (error) {
      dispatch({
          type: APPOINTMENT_PAY_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
};

export const reviewAppointment = (id) => async (dispatch) => {
  try {
      dispatch({ type: APPOINTMENT_REVIEW_REQUEST });

      const { data } = await axiosInstance.put(
          `/api/appointments/${id}/review/`
      );

      dispatch({ type: APPOINTMENT_REVIEW_SUCCESS, payload: data });
  } catch (error) {
      dispatch({
          type: APPOINTMENT_REVIEW_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
};


export const listDoctorAppointments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: APPOINTMENT_LIST_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.access}`,
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axiosInstance.get('/api/appointments/doctor/', config);

    dispatch({
      type: APPOINTMENT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: APPOINTMENT_LIST_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const updateAppointment = (appointmentId, googleMeetLink) => async (dispatch, getState) => {
  try {
    dispatch({ type: APPOINTMENT_UPDATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axiosInstance.post(
      `/api/appointments/doctor/update/`,
      { appointment_id: appointmentId, google_meet_link: googleMeetLink },
      config
    );

    dispatch({ type: APPOINTMENT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: APPOINTMENT_UPDATE_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};


export const updateAppointmentStatus = (appointmentId, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: APPOINTMENT_UPDATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axiosInstance.post(
      `/api/appointments/doctor/consulted-update/`,
      { appointment_id: appointmentId, status: status },
      config
    );

    dispatch({ type: APPOINTMENT_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: APPOINTMENT_UPDATE_FAIL,
      payload: error.response && error.response.data.detail
        ? error.response.data.detail
        : error.message,
    });
  }
};
