export type AuthMode = 'required' | 'optional' | 'try';

export type ScopeModes = 'required' | 'forbidden' | 'some'

export interface AuthCredentials {}
export interface AuthArtifacts {}

export type BaseSuccesfullAuth<
Credentials = AuthCredentials, Artifacts = AuthArtifacts
> = {
    credentials: Maybe<Credentials>;
    artifacts: Maybe<Artifacts>;
    isAuthorized: true;
    isAuthenticated: true;
    /** the route authentication mode. */
    mode: AuthMode;
    /** the name of the strategy used. */
    strategy: string;
    errorResponse: never;
}

export type BaseFailedAuth<
Credentials = AuthCredentials, Artifacts = AuthArtifacts
> = {
    credentials: Maybe<Credentials>;
    artifacts: Maybe<Artifacts>;
    isAuthorized: false;
    isAuthenticated: false;
    /** the route authentication mode. */
    mode: Exclude<AuthMode, 'required'>;
    /** the name of the strategy used. */
    strategy: string;
    errorResponse: Response;
}