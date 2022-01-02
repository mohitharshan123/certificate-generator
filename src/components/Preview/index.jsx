import { useTemplates } from "../../context";
import { useEffect, useState } from "react";

const Preview = () => {
  const [{ selectedTemplate, htmlText }, dispatch] = useTemplates();
  const [css, setCss] = useState("");
  const setHtmlPreview = async () => {
    const htmlData = await selectedTemplate["index.html"].async("text");
    setCss();
    dispatch({ type: "set_html", payload: htmlData });
  };
  useEffect(() => {
    if (selectedTemplate) {
      setHtmlPreview();
    }
  }, [selectedTemplate]);
  return (
    <div className="flex flex-row items-center justify-center w-full h-screen p-4">
      <iframe
        id="preview"
        className="w-full h-full bg-white pointer-events-none flex-grown"
        srcDoc={htmlText}
      ></iframe>
    </div>
  );
};

export { Preview };
