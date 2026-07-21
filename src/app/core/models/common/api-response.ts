export class ApiResponse {
    success: boolean;
    message: string;
}

export class ApiDataResponse<TData> extends ApiResponse {
    data: TData;
}