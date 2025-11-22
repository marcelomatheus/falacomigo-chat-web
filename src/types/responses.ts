type DataShape = Record<string, unknown> | unknown[];

type ActionSuccess<T> = {
    status: true;
    data?: T;
    error?: never;
};

type ActionError = {
    status: false;
    error: string;
    data?: never;
};

export type ActionResponse<T extends DataShape = DataShape> = 
    | ActionSuccess<T> 
    | ActionError;