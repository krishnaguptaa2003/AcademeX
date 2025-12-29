// src/pages/academics/PrintResult.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

function PrintResult() {
  const { id } = useParams();
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/results/${id}`, {
          withCredentials: true,
          validateStatus: () => true,
        });
        if (res.status === 200 && res.data?.success) {
          setResult(res.data.data);
          // Give React a tick so DOM is ready then print
          setTimeout(() => window.print(), 200);
        }
      } catch (err) {
        console.error("Print result error:", err);
      }
    }
    load();
  }, [id]);

  if (!result) return null;

  return (
    <div className="min-h-screen bg-white p-8 print:p-0">
      <div className="max-w-xl mx-auto border border-gray-300 rounded-lg p-8 shadow-sm print:shadow-none print:border-0">
        <h1 className="text-center text-2xl font-semibold mb-6">
          AcademeX – Marksheet
        </h1>

        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span className="font-medium">Student ID:</span>
            <span>{result.studentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Student Name:</span>
            <span>{result.studentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Course:</span>
            <span>{result.course}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Semester:</span>
            <span>{result.semester}</span>
          </div>
        </div>

        <table className="w-full border border-gray-300 text-sm mb-8">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Marks
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                {result.marks}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {result.grade}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-between text-xs mt-8">
          <div>
            ____________________________
            <div>Faculty Signature</div>
          </div>
          <div className="text-right">
            Date: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrintResult;
