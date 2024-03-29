import {useUserContext} from "../../../services/user-context";
import {FC, ReactNode} from "react";
import {Link} from "react-router-dom";

export const Auth: FC<{ children: ReactNode }>= ({ children }) => {
    const user = useUserContext();

    return user
        ? <>{children}</>
        :  <div className="m-5 d-flex justify-content-center align-items-center">
                <h5><Link to="/sign-in">Zaloguj się</Link> by obstawiać!</h5>
        </div>        
}