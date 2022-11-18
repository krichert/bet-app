import Navigation from "./components/navigation";
import Content from "./components/content";

import { UserContextProvider } from "./services/user-context";

function App() {
  return (
    <UserContextProvider>
        <Navigation />
        <Content />
    </UserContextProvider>
  );
}

export default App;
