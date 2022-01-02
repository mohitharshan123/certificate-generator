import React, { useReducer, useContext } from "react";

const TemplatesContext = React.createContext();

const templatesReducer = (state, action) => {
  switch (action.type) {
    case "set_selected_template": {
      return { ...state, selectedTemplate: action.payload };
    }
    case "set_html": {
      return { ...state, htmlText: action.payload };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const TemplatesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(templatesReducer, {
    selectedTemplate: null,
    htmlText: "",
  });
  const value = [state, dispatch];
  return (
    <TemplatesContext.Provider value={value}>
      {children}
    </TemplatesContext.Provider>
  );
};

function useTemplates() {
  const context = useContext(TemplatesContext);
  if (context === undefined) {
    throw new Error("useCount must be used within a CountProvider");
  }
  return context;
}

export { TemplatesProvider, useTemplates };
