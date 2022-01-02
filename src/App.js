import { Editor } from "./components/Editor";
import { Preview } from "./components/Preview";
import { Templates } from "./components/Templates";
import { TemplatesProvider } from "./context";

const App = () => {
  return (
    <div className="flex flex-row w-full justify-between">
      <TemplatesProvider>
        <Templates />
        <Preview />
        <Editor />
      </TemplatesProvider>
    </div>
  );
};

export default App;
