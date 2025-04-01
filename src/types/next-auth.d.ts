import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User extends DefaultUser {
        username: string; // Optional field if not always present
      }
    interface Session{
        user:{
            id: string ;
            username: string;
            email:string;
        } & DefaultSession['user']
       

    }
    interface Token{
        username:string ;
        email:string ;
        sub:email;
    }

}
declare module 'next-auth' {
    interface Token{
        username:string;
        email:string;
        sub:string;
        id:string
    }

}