import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import facultyService from "@/services/api/facultyService";

const Faculty = () => {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    qualification: "",
    joiningDate: ""
  });

  useEffect(() => {
    loadFaculty();
  }, []);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await facultyService.getAll();
      setFaculty(data);
      setFilteredFaculty(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    const filtered = faculty.filter(f =>
      f.firstName.toLowerCase().includes(value.toLowerCase()) ||
      f.lastName.toLowerCase().includes(value.toLowerCase()) ||
      f.email.toLowerCase().includes(value.toLowerCase()) ||
      f.department.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFaculty(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await facultyService.create(formData);
      toast.success("Faculty member added successfully!");
      setShowModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        designation: "",
        qualification: "",
        joiningDate: ""
      });
      loadFaculty();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      try {
        await facultyService.delete(id);
        toast.success("Faculty member deleted successfully!");
        loadFaculty();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadFaculty} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-800 to-primary-600 bg-clip-text text-transparent">
            Faculty
          </h1>
          <p className="text-gray-600 mt-1">Manage faculty members and assignments</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <ApperIcon name="UserPlus" size={18} className="mr-2" />
          Add Faculty
        </Button>
      </div>

      <div className="mb-6">
        <SearchBar
          placeholder="Search faculty by name, email, or department..."
          onSearch={handleSearch}
        />
      </div>

      {filteredFaculty.length === 0 ? (
        <Empty
          title="No faculty members found"
          message="Add your first faculty member to get started"
          icon="Users"
          action={() => setShowModal(true)}
          actionLabel="Add Faculty"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFaculty.map((member, index) => (
            <motion.div
              key={member.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="p-6 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                onClick={() => navigate(`/faculty/${member.Id}`)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {member.firstName[0]}{member.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{member.designation}</p>
                    <p className="text-xs text-gray-500 mt-1">{member.employeeId}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Building2" size={16} className="text-gray-400" />
                    <span className="text-gray-700">{member.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="GraduationCap" size={16} className="text-gray-400" />
                    <span className="text-gray-700">{member.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Mail" size={16} className="text-gray-400" />
                    <span className="text-gray-700 truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ApperIcon name="Phone" size={16} className="text-gray-400" />
                    <span className="text-gray-700">{member.phone}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Courses Assigned</span>
                    <span className="font-semibold text-primary-700">
                      {member.assignedCourses.length}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/faculty/${member.Id}`);
                    }}
                  >
                    View Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(member.Id);
                    }}
                  >
                    <ApperIcon name="Trash2" size={16} className="text-red-600" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Faculty Member"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Add Faculty
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

            <FormField label="Designation" id="designation" required>
              <Select
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                required
              >
                <option value="">Select Designation</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Lecturer">Lecturer</option>
              </Select>
            </FormField>
          </div>

          <FormField
            label="Qualification"
            id="qualification"
            required
            placeholder="e.g., PhD in Computer Science"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
          />

          <FormField
            label="Joining Date"
            id="joiningDate"
            type="date"
            required
            value={formData.joiningDate}
            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
          />
        </form>
      </Modal>
    </div>
  );
};

export default Faculty;