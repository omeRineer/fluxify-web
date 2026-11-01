export namespace UserDto {
    export interface List {
        id: string;
        nameSpaceId: string;
        name: string;
        email: string;
        key: string;
    }

    export interface Profile {
        id: string;
        nameSpaceId: string;
        name: string;
        title: string;
        email?: string;
        phone?: string;
        userName: string;
        password: string;
        key: string;
        birthdayDate: Date;
        accountDate: Date;
    }
}