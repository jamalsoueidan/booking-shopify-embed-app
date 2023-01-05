interface ApiResponse<T> {
  success: boolean;
  error?: string;
  payload?: T;
}
