import React, { useState } from "react";
import * as XLSX from "xlsx";

function App() {
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        const reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only Excel file types");
        setExcelFile(null);
      }
    } else {
      setTypeError("Please select your file");
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      setLoading(true);
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0, 15));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <h3 className="text-3xl font-bold mb-8">Upload & View Excel Data</h3>

      <form
        onSubmit={handleFileSubmit}
        className="flex flex-col items-center w-full max-w-md"
      >
        <input
          type="file"
          required
          onChange={handleFile}
          className="mb-4 px-4 py-2 border border-gray-300 rounded-lg w-full"
          aria-label="File upload"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
        {typeError && <div className="text-red-500 mt-2">{typeError}</div>}
      </form>

      <div className="mt-8 w-full overflow-x-auto rounded-lg">
        {excelData ? (
          <div className="bg-white shadow-lg ">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-500 text-white ">
                <tr>
                  {Object.keys(excelData[0]).map((key) => (
                    <th
                      key={key}
                      className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 max-h-80 overflow-y-auto">
                {excelData.map((individualExcelData, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    {Object.keys(individualExcelData).map((key) => (
                      <td
                        key={key}
                        className="px-4 py-2 whitespace-nowrap text-sm"
                      >
                        {individualExcelData[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center text-gray-500">
            No file is uploaded yet!
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
