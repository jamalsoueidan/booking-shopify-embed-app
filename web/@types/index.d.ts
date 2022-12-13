interface ApiResponse<T> {
  status: "success" | "error";
  error?: string;
  payload?: T;
}
