// src/pages/faculty/FacultyList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Table from "../../components/ui/Table";
import { useToast } from "../../contexts/ToastContext";

// Demo data if API fails / empty
const fallbackFaculty = [
  {
    _id: "demo1",
    employeeId: "FAC1001",
    name: "Dr. Anjali Mehta",
    department: "Computer Science",
    email: "anjali.mehta@example.com",
    phone: "9876543210",
  },
  {
    _id: "demo2",
    employeeId: "FAC1002",
    name: "Prof. Rohan Shah",
    department: "Mechanical Engineering",
    email: "rohan.shah@example.com",
    phone: "9876543211",
  },
];

function FacultyList() {
  const { user } = useAuth(); // ✅ hook used correctly
  const isAdmin = user?.role === "ADMIN";

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchFaculty = async () => {
      try {
        const response = await axios.get("/api/faculty");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.faculty || [];

        if (!isMounted) return;

        if (!data.length) {
          setFaculty(fallbackFaculty);
          addToast("No faculty found from API. Showing demo data.", "info");
        } else {
          setFaculty(data);
        }
      } catch (err) {
        console.error("Error fetching faculty:", err);
        if (!isMounted) return;

        setFaculty(fallbackFaculty);
        addToast(
          "Failed to fetch faculty from API. Showing demo data.",
          "error"
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFaculty();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!isAdmin) return;

    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      try {
        await axios.delete(`/api/faculty/${id}`);
        setFaculty((prev) => prev.filter((member) => member._id !== id));
        addToast("Faculty member deleted successfully", "success");
      } catch (err) {
        console.error("Delete error:", err);
        addToast("Failed to delete faculty member", "error");
      }
    }
  };

  const columns = [
    { header: "Employee ID", accessor: "employeeId" },
    { header: "Name", accessor: "name" },
    { header: "Department", accessor: "department" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Actions",
      accessor: "_id",
      Cell: ({ value }) =>
        isAdmin ? (
          <div className="flex space-x-2">
            <Link
              to={`/faculty/${value}`}
              className="text-gray-600 hover:text-gray-900"
              title="View"
            >
              <UserIcon className="h-5 w-5" />
            </Link>

            <Link
              to={`/faculty/${value}/edit`}
              className="text-primary hover:text-primary-dark"
              title="Edit"
            >
              <PencilIcon className="h-5 w-5" />
            </Link>

            <button
              onClick={() => handleDelete(value)}
              className="text-red-600 hover:text-red-800"
              title="Delete"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">No actions</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Faculty Management</h1>

        {isAdmin && (
          <Link to="/faculty/new">
            <Button>
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Faculty
            </Button>
          </Link>
        )}
      </div>

      <Card>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <Table columns={columns} data={faculty} />
        )}
      </Card>
    </div>
  );
}

export default FacultyList;
