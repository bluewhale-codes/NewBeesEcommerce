import { LOGIN_REQUEST ,
        LOGIN_SUCCESS,
        LOGIN_FAIL,
        CLEAR_ERRORS ,
        REGISTER_USER_FAIL,
        REGISTER_USER_REQUEST,
        REGISTER_USER_SUCCESS} from "../constants/userConstants"



export const userReducer =(state ={user:{}},action) =>{
    switch (action.type) {
        case REGISTER_USER_REQUEST:
            return{
                loading:true,
                isAuthenticated:false
            }
        
        case REGISTER_USER_SUCCESS:
            return{
                ...state,
                loading:false,
                isAuthenticated:true,
                user:action.payload
            }
        
        case REGISTER_USER_FAIL:
            return{
                ...state,
                loading:false,
                isAuthenticated:false,
                user:null,
                registerError:action.payload
            }
        case CLEAR_ERRORS:
          
          return {
              ...state,
              error:null,
              registerError:null,
          };
    
        default:
          return state
    }   
};
export const loginReducer =(state ={login:{}},action) =>{
     switch (action.type) {
         case LOGIN_REQUEST:
             return{
                 loading2:true,
                 isAuthenticated2:false
             }
         case LOGIN_SUCCESS:
             return{
                 ...state,
                 loading2:false,
                 isAuthenticated2:true,
                 user2:action.payload,
             }
         case LOGIN_FAIL:
             return{
                 ...state,
                 loading2:false,
                 isAuthenticated2:false,
                 user2:null,
                 error:action.payload
             }

         case CLEAR_ERRORS :
          
           return {
               ...state,
               error:null,
              
           };
    
         default:
           return state
     }   
 };
