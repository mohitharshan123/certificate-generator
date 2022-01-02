import { useState, useEffect, useRef } from "react";
import storage from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytes, listAll, getBlob } from "firebase/storage";
import JSZip from "jszip";
import LoadingSpinner from "../Common/LoadingSpinner";
import { useTemplates } from "../../context";

const Templates = () => {
  const [file, setFile] = useState(null);
  const [templates, setTemplates] = useState([]);
  const inputFileRef = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const [state, dispatch] = useTemplates();

  const loadTemplates = async () => {
    const templatesRef = ref(storage, "templates/");
    try {
      const { items } = await listAll(templatesRef);
      const contents = [];
      setTemplates([]);
      await items.map(async (folderRef) => {
        const file = await getBlob(ref(storage, folderRef.fullPath));
        const content = await downloadAndSetTemplates(file);
        contents.push(content);
        setTemplates([...new Set([...contents, content])]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const downloadAndSetTemplates = async (file) => {
    try {
      const zipFile = new JSZip();
      const { files: templateFiles } = await zipFile.loadAsync(file);
      const thumbnail = await templateFiles["thumbnail.png"].async("base64");
      return { thumbnail, templateFiles };
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleUpload = async () => {
    if (file === null) return;
    try {
      setIsUploading(true);
      const newTemplateRef = ref(storage, `templates/${uuidv4()}.zip`);
      try {
        await uploadBytes(newTemplateRef, file);
        loadTemplates();
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setFile(null);
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-1/2 h-screen p-8 space-y-3 overflow-auto bg-gradient-to-r from-cyan-900 to-blue-900">
      <div>
        <p className="font-semibold text-white text-md">Instructions for zip</p>
        <span>
          <ul className="text-sm font-thin text-white list-disc">
            <li>Upload only .zip file</li>
            <li>
              Zip should contain a thumbnail.png image to display thumbnail
            </li>
            <li>Zip should contain an index.html file</li>
            <li>
              All editable fields in certifcate should contain a data-editable
              attribute
            </li>
            <li className="text-xs">
              Example:{" "}
              {`<span data-editable="Organization">Organization Name</span>`}
            </li>
            <li>
              Css can be kept in a separate file or inline. If inline preview
              will be styled.
            </li>
          </ul>
        </span>
      </div>
      <input
        ref={inputFileRef}
        type="file"
        className="hidden"
        onChange={({ target: { files } }) => {
          setFile(files[0]);
        }}
      />
      <button
        onClick={() => inputFileRef.current?.click()}
        className="p-3 font-medium text-white rounded-full shadow-lg bg-cyan-500 hover:bg-sky-700 shadow-cyan-500/50"
      >
        Select File
      </button>
      <span className="text-white">{file?.name}</span>
      <button
        onClick={handleUpload}
        className="p-2 px-5 font-medium text-white bg-indigo-500 rounded-full shadow-lg hover:bg-violet-400 shadow-indigo-500/50 "
      >
        <div className="flex flex-row items-center space-x-2">
          <span> Upload</span> {isUploading && <LoadingSpinner />}
        </div>
      </button>{" "}
      <div className="flex flex-col space-y-4 ">
        {templates?.map(({ thumbnail, templateFiles }) => (
          <img
            onClick={() =>
              dispatch({
                type: "set_selected_template",
                payload: templateFiles,
              })
            }
            className="bg-white rounded-md cursor-pointer hover:scale-105"
            src={`data:image/png;base64, ${thumbnail}`}
          />
        ))}
      </div>
    </div>
  );
};

export { Templates };
