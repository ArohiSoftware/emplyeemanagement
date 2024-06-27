import { toast, Toaster } from "sonner";
import { lazy, startTransition, useEffect, useRef, useState } from "react";
import Register from "../Register/Register";
import "./manage.css";
import axios from "axios";

// Lazy load the EmployeeDetails component
const EmployeeDetails = lazy(() => import('../EmployeeDetails'));


function Manage() {
  const dialogRef = useRef();
  const [detail, setDetail] = useState([{

  }])



  const getData = async () => {

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const response = await axios.get("http://localhost:5200/api/v1/admin/getUsers", config);
    const data = response.data.data;
    setDetail(data);
  };

  

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="bg-slate-200 dark dark:bg-black dark:text-white p-8 from-slate-200 to-slate-400 shadow-md dark:shadow-gray-800 shadow-gray-400 rounded-xl">
      <Toaster position="top-right" richColors closeButton expand={true} />
      <button onClick={() => dialogRef.current.showModal()} className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2">
        Add Employee
      </button>
      <dialog ref={dialogRef} autoFocus className="transition-all rounded-lg p-3 min-w-[40vw] max-w-[60vw] w-full ">
        <button className="absolute right-2 top-1 hover:font-bold" onClick={() => dialogRef.current.close()}>close</button>
        <Register />
      </dialog>
      <br />
      <br />
      <ShowTable detail={detail} />
    </div>
  );
}

function ShowTable({ detail }) {
  return (
    <div className="w-full dark dark:text-white border p-6 text-lg rounded-lg">
      <div className="responsive-grid dark:text-white">
        <h1>First Name</h1>
        <h1>Last Name</h1>
        <h1>Email</h1>
        <h1>Modify / Delete</h1>
      </div>
      <div>
        <ShowTabeData DataObject={detail} />
      </div>
    </div>
  );
}





function ShowTabeData({ DataObject }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const deleteEmployeeRef = useRef();

  const deleteEmployee = async (email) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    };

    const body = { email };

    try {
      const response = await axios.delete("http://localhost:5200/api/v1/admin/deleteUser", { data: body }, config);

      if (response.data.success) {
        toast.success("Employee Deleted Successfully");
      }
    } catch (error) {
      toast.error("Error deleting employee");
    }
  };

  const handleDelete = (email) => {
    setCurrentEmail(email);
    deleteEmployeeRef.current.showModal();
  };

  const confirmDelete = () => {
    if (deleteEmail === currentEmail) {
      deleteEmployee(currentEmail);
      deleteEmployeeRef.current.close();
    } else {
      toast.error("Emails do not match. Deletion canceled.");
    }
  };

  return (
    <div className="dark dark:text-white">
      {DataObject.map((data, i) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 sm:gap-x-10 md:gap-x-16 lg:gap-x-24 xl:gap-x-36 auto-cols-auto py-5 border border-gray-600 p-8 my-4 border-r-0 border-l-0 border-b-0  shadow-sm shadow-gray-400 rounded-xl" key={i}>

          <h2 className="overflow-y-hidden">{data.firstName} </h2>
          <h2> {data.lastName}</h2>
          <h2 className="text-center w-20">{data.email}</h2>

          
          <button
            onClick={() => handleDelete(data.email)}
            className="hover:bg-red-600 dark:text-black bg-red-200 w-24 p-2 rounded-2xl"
          >
            delete
          </button>


          <button onClick={() => {
            startTransition(() => {
              setSelectedEmployee(data);
            });
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ellipsis-vertical">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {selectedEmployee && selectedEmployee._id === data._id && (
            <dialog open={true} className="relative z-10 -translate-y-96">
              <EmployeeDetails details={selectedEmployee} empRef={deleteEmployeeRef} />
              <button onClick={() => {
                startTransition(() => {
                  setSelectedEmployee(null);
                });
              }} className="text-white absolute top-3 right-6">Close</button>
            </dialog>
          )}
        </div>
      ))}


      <dialog ref={deleteEmployeeRef} className="relative z-10 p-5 rounded-lg">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p>Enter the employees email to confirm deletion:</p>
        <input
          type="email"
          value={deleteEmail}
          onChange={(e) => setDeleteEmail(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <div className="flex justify-end">
          <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded mr-2">Confirm</button>
          <button onClick={() => deleteEmployeeRef.current.close()} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
        </div>
      </dialog>
    </div>
  );
}


export default Manage

