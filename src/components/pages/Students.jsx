import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import DataTable from "@/components/molecules/DataTable";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import studentService from "@/services/api/studentService";
import { format } from "date-fns";

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    department: "",
    semester: "",
    status: "active",
    aadharCardPdf: null
  });
  const [pdfFileName, setPdfFileName] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filtered = students.filter(student =>
      student.firstName.toLowerCase().includes(value.toLowerCase()) ||
      student.lastName.toLowerCase().includes(value.toLowerCase()) ||
      student.email.toLowerCase().includes(value.toLowerCase()) ||
      student.studentId.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate PDF file if provided
    if (formData.aadharCardPdf) {
      const file = formData.aadharCardPdf;
      if (file.type !== 'application/pdf') {
        toast.error("Please upload a valid PDF file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("PDF file size must be less than 5MB");
        return;
      }
    }
    
    try {
      await studentService.create(formData);
      toast.success("Student added successfully!");
      setShowModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        address: "",
        department: "",
        semester: "",
        status: "active",
        aadharCardPdf: null
      });
      setPdfFileName("");
      loadStudents();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFileName(file.name);
      setFormData({ ...formData, aadharCardPdf: file });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await studentService.delete(id);
        toast.success("Student deleted successfully!");
        loadStudents();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const columns = [
    {
      field: "studentId",
      label: "Student ID",
      sortable: true
    },
    {
      field: "firstName",
      label: "Name",
      sortable: true,
      render: (_, student) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
            {student.firstName[0]}{student.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-gray-900">{student.firstName} {student.lastName}</p>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        </div>
      )
    },
    {
      field: "department",
      label: "Department",
      sortable: true
    },
    {
      field: "semester",
      label: "Semester",
      sortable: true
    },
    {
      field: "status",
      label: "Status",
      render: (status) => (
        <Badge variant={
          status === "active" ? "success" :
          status === "inactive" ? "warning" :
          status === "graduated" ? "info" : "danger"
        }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-gray-600 mt-1">Manage student records and information</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <ApperIcon name="UserPlus" size={18} className="mr-2" />
          Add Student
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-6">
          <SearchBar
            placeholder="Search by name, email, or student ID..."
            onSearch={handleSearch}
          />
        </div>

        {filteredStudents.length === 0 ? (
          <Empty
            title="No students found"
            message="Start by adding your first student to the system"
            icon="Users"
            action={() => setShowModal(true)}
            actionLabel="Add Student"
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredStudents}
            onRowClick={(student) => navigate(`/students/${student.Id}`)}
            actions={(student) => (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/students/${student.Id}`)}
                >
                  <ApperIcon name="Eye" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(student.Id)}
                >
                  <ApperIcon name="Trash2" size={16} className="text-red-600" />
                </Button>
              </>
            )}
          />
        )}
      </motion.div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Student"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Add Student
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="First Name"
              id="firstName"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <FormField
              label="Last Name"
              id="lastName"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Email"
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <FormField
              label="Phone"
              id="phone"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <FormField
            label="Date of Birth"
            id="dateOfBirth"
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />

<FormField
            label="Address"
            id="address"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <FormField label="Aadhaar Card PDF" id="aadharCardPdf">
            <div className="space-y-2">
              <input
                type="file"
                id="aadharCardPdf"
                accept="application/pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
              />
              {pdfFileName && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ApperIcon name="FileText" size={16} />
                  <span>{pdfFileName}</span>
                </div>
              )}
              <p className="text-xs text-gray-500">Upload Aadhaar card in PDF format (Max 5MB)</p>
            </div>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Department" id="department" required>
              <Select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </Select>
            </FormField>

            <FormField
              label="Semester"
              id="semester"
              type="number"
              min="1"
              max="8"
              required
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;