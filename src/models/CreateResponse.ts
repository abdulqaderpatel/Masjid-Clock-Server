import ApiResponse from "./ApiResponse";

export default function createResponse<T>(apiResponse: ApiResponse<T>,) {
    return apiResponse;
}