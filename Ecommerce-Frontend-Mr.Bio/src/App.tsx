import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Routes from "./routes";
import { AuthProvider } from "./services/auth/AuthContext";
import { LoginProvider } from "./services/auth/context/LoginContext";
import { ModalProvider } from "./shared/context/ModalContext";

function App() {
  // const [loading, setLoading] = useState(true); // Initial loading state
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 0, // Forces React Query to always refetch on mount or when navigating back
        refetchOnWindowFocus: true, // Refetch data when the window is focused
        refetchOnReconnect: true, // Refetch data when the connection is restored
      },
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      // setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // if (loading) {
  //   return (
  //     <div className="loading-screen">
  //       <video autoPlay loop muted>
  //         <source src={mrbio_1} type="video/mp4" />
  //       </video>
  //     </div>
  //   );
  // }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoginProvider>
          <ModalProvider>
            <ToastContainer autoClose={3000} />
            <Routes />
          </ModalProvider>
        </LoginProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
