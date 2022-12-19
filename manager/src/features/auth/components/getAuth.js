import { useSelector } from "react-redux";

export function useAuth() {
  return useSelector((state) => state.auth);
}
