import { useTemplates } from "../../context";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Editor = () => {
  const [{ selectedTemplate, htmlText }, dispatch] = useTemplates();
  const [editableFields, setEditableFields] = useState([]);
  const [updatedHtml, setUpdatedHtml] = useState("");
  var parser = new DOMParser();
  const htmlDoc = parser.parseFromString(htmlText, "text/html");

  useEffect(() => {
    setEditableFields([...htmlDoc.querySelectorAll("[data-editable]")]);
  }, [htmlText]);

  const handleValueChange = (field, value) => {
    const editableFieldsClone = [...editableFields];
    const fieldToUpdate = editableFieldsClone.find(
      (editable) => editable === field
    );
    let htmlTextClone = htmlText;
    fieldToUpdate.innerHTML = value;
    const elementToEdit = htmlDoc.querySelectorAll(
      `[data-editable="${field.getAttribute("data-editable")}"]`
    )[0];

    htmlTextClone = htmlTextClone.replace(
      elementToEdit.outerHTML,
      fieldToUpdate.outerHTML
    );
    setUpdatedHtml(htmlTextClone);
    dispatch({ type: "set_html", payload: htmlTextClone });
    setEditableFields(editableFieldsClone);
  };

  const handleDeploy = async () => {
    var zip = new JSZip();
    delete selectedTemplate["index.html"];
    delete selectedTemplate["thumbnail.png"];
    await Object.entries(selectedTemplate).forEach(async ([location, file]) => {
      const fullPathArray = location.split("/");
      const fileName = fullPathArray.pop();
      const fileContent = await file.async("text");
      await zip.file(fileName, fileContent);
    });

    zip.file("index.html", updatedHtml);
    setTimeout(
      () =>
        zip
          .generateAsync({ type: "blob" })
          .then((blob) => saveAs(blob, "template.zip")),
      2000
    );
  };

  return (
    <>
      <div className="flex flex-col w-1/2 h-screen p-4 space-y-3 bg-gradient-to-r from-cyan-700 to-blue-900">
        {editableFields?.map((field) => (
          <>
            <label
              htmlFor={field.getAttribute("data-editable")}
              className="font-semibold text-white"
            >
              {field.getAttribute("data-editable")}
            </label>
            <input
              type="text"
              onChange={({ target: { value } }) =>
                handleValueChange(field, value)
              }
              value={field.innerHTML}
              id={field.getAttribute("data-editable")}
              className="p-2 border-2 rounded-md"
            />
          </>
        ))}
        <button
          onClick={() => handleDeploy()}
          className="p-2 px-5 font-medium text-white bg-indigo-500 rounded-full shadow-lg hover:bg-violet-400 shadow-indigo-500/50 "
        >
          Deploy
        </button>
      </div>
    </>
  );
};

export { Editor };
