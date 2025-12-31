import { LOGIN_REQUEST ,
        LOGIN_SUCCESS,
        LOGIN_FAIL,
        CLEAR_ERRORS ,
        REGISTER_USER_FAIL,
        REGISTER_USER_REQUEST,
        REGISTER_USER_SUCCESS} from "../constants/userConstants"
import axios from "axios";
export const registerUser = (userData)=> async(dispatch)=>{
    try {
      dispatch({
         type:REGISTER_USER_REQUEST
      })
      console.log(userData);
      const config = {headers:{"Content-Type":"application/json"}}
 
      const {data} = await axios.post("http://localhost:5000/api/users/createUser",userData,config);
      console.log(data);
     
 
     dispatch({
         type:REGISTER_USER_SUCCESS,
         payload:data.message,
     })
    } catch (error) {
       console.error('Register error:', {
    status: error?.response?.status,
    data: error?.response?.data,
    message: error?.message,
  });
  dispatch({
    type: REGISTER_USER_FAIL,
    payload:
      error?.response?.data?.message ||
      error?.response?.data?.detail ||   // FastAPI often sends {detail: "..."}
      error?.message ||
      'Registration failed',
  });
    }
 };


export const login = ({email, password}) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    // ✅ Important: allow cookies from backend
    const config = {
      headers: { "Content-Type": "application/json" },
      withCredentials: true, // crucial for HttpOnly cookie
    };

     const {data} = await axios.post("http://localhost:5000/api/users/loginUser",{email,password},config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: data, // You can store user info or message
    });
  } catch (error) {
    console.error("Login error:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });

    dispatch({
      type: LOGIN_FAIL,
      payload:
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        "Login failed",
    });
  }
};
