export interface Base {
    exceptionReport: any;
}

export interface Authentication  {
    userId: string;
}

export interface AuthenticationResposne extends Base {
    userDetails: UserDetails;
}

export interface UserDetails {
    userId: string;
    userName: string;
    isValidUser: boolean;
    role: string;
}

export interface Session {
    activeSession: boolean;
}


export interface SessionResponse extends Base {
    session: Session;
}