export type UserContextInfo = {
    NameIdentifier:string | null;
    Key:string | null;
    ApiKey:string | null;
    Name:string | null;
    Device:string | null;
    Platform:string | null;
    NameSpaceId:string | null;
    NameSpace:string | null;
    isAuthenticated:boolean;
}

export const INITIAL_USER_CONTEXT: UserContextInfo = {
    NameIdentifier: null,
    Key: null,
    ApiKey: null,
    Name: null,
    Device: null,
    Platform: null,
    NameSpaceId: null,
    NameSpace: null,
    isAuthenticated: false
};