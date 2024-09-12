// Import hooks from React for referencing elements, state management, and side effects
import React, { useRef, useState, useLayoutEffect } from 'react'; 
import { ToastContainer, toast } from 'react-toastify'; //  Import toast notifications 
import { v4 as uuidv4 } from 'uuid';       // Import uuidv4 function to generate unique IDs for each password
import 'react-toastify/dist/ReactToastify.css';  // Import styles for react-toastify


// Define the Manager component
const Manager = () => {
    const ref = useRef();     // Create a ref for the show/hide password icon element
    const passwordRef = useRef();   // Create a ref for the password input field
    const [form, setForm] = useState({ site: "", username: "", password: "" }); // State to manage form input (site, username, password)
    const [passwordArray, setPasswordArray] = useState([]);  // State to manage the array of saved passwords
    const [isEditing, setIsEditing] = useState(false);

// Runs after the initial render to load passwords from localStorage
    useLayoutEffect(() => {
        let passwords = localStorage.getItem("passwords");
        if (passwords) {
            setPasswordArray(JSON.parse(passwords));
        }
    }, []);

// Function to copy text to clipboard and show toast notification
    const copyText = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Copied to clipboard!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        });
    };

// Function to toggle password visibility
    const showPassword = () => {
        if (passwordRef.current.type === "password") {// If password is hidden, show it
            passwordRef.current.type = "text"; 
            ref.current.src = "icons/eyecross.png"; // Change icon to crossed eye
        } else {
            passwordRef.current.type = "password"; // If visible, hide it
            ref.current.src = "icons/eye.png"; // Change icon to normal eye
        }
    };

// Function to save or edit a password
    const savePassword = () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            if (isEditing) {
                // Edit existing password
                const updatedPasswords = passwordArray.map((password) =>
                    password.id === form.id ? form : password // Update the password with matching ID
                );
                setPasswordArray(updatedPasswords); // Set updated password array
                localStorage.setItem("passwords", JSON.stringify(updatedPasswords)); // Save to localStorage
                toast.success("Password edited successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                // Save new password
                const newPassword = { ...form, id: uuidv4() }; // Add unique ID to the new password
                const updatedPasswords = [...passwordArray, newPassword]; // Add new password to the array
                setPasswordArray(updatedPasswords); // Update the password array
                localStorage.setItem("passwords", JSON.stringify(updatedPasswords)); // Save to localStorage
                toast.success("Password saved successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }

            // Reset form and stop editing
            setForm({ site: "", username: "", password: "" });
            setIsEditing(false);
        } else {
            toast.error("All fields must be greater than 3 characters!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

// Function to delete a password by its ID
    const deletePassword = (id) => {
        const confirmDelete = window.confirm("Do you really want to delete this password?"); // Confirm deletion
        if (confirmDelete) {
            const updatedPasswords = passwordArray.filter(item => item.id !== id); // Remove password by ID
            setPasswordArray(updatedPasswords); // Update state
            localStorage.setItem("passwords", JSON.stringify(updatedPasswords)); // Save to localStorage
            toast.success('Password Deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

 // Function to edit a password by its ID
    const editPassword = (id) => {
        const passwordToEdit = passwordArray.find(i => i.id === id); // Find password by ID
        setForm(passwordToEdit); // Populate form with password data
        setIsEditing(true); // Set editing state to true
    };

// Function to handle form input changes and update the form state
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value }); // Update form state
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
             {/* Background gradient */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
            </div>
            <div className="p-3 md:mycontainer min-h-[88.2vh]">
                <h1 className='text-4xl text font-bold text-center'>
                    <span className='text-green-500'>&lt;</span>
                    <span>Pass</span><span className='text-green-500'>OP/&gt;</span>
                </h1>
                <p className='text-green-900 text-lg text-center'>Your own Password Manager</p>


                {/* Form to save/edit passwords */}
                <div className="flex flex-col p-4 text-black gap-8 items-center">
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="site" id="site" />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="username" id="username" />
                        <div className="relative">
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" name="password" id="password" />
                            <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit border border-green-900'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover" >
                        </lord-icon>
                        {isEditing ? "Edit" : "Save"}
                    </button>
                </div>

                {/* Table to display saved passwords */}
                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No passwords to show</div>}
                    {passwordArray.length !== 0 && (
                        <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                            <thead className='bg-green-800 text-white'>
                                <tr>
                                    <th className='py-2'>Site</th>
                                    <th className='py-2'>Username</th>
                                    <th className='py-2'>Password</th>
                                    <th className='py-2'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-100'>
                                {passwordArray.map((item) => (
                                    <tr key={item.id}>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center'>
                                                <a href={item.site} target='_blank' rel="noopener noreferrer">{item.site}</a>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => copyText(item.site)}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center'>
                                                <span>{item.username}</span>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => copyText(item.username)}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='py-2 border border-white text-center'>
                                            <div className='flex items-center justify-center'>
                                            <span>{"*".repeat(item.password.length)}</span>
                                                <div className='lordiconcopy size-7 cursor-pointer' onClick={() => copyText(item.password)}>
                                                    <lord-icon
                                                        style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='justify-center py-2 border border-white text-center'>
                                            <span className='cursor-pointer mx-1' onClick={() => editPassword(item.id)}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/gwlusjdu.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                            <span className='cursor-pointer mx-1' onClick={() => deletePassword(item.id)}>
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/skkahier.json"
                                                    trigger="hover"
                                                    style={{ "width": "25px", "height": "25px" }}>
                                                </lord-icon>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};

export default Manager; // Export the Manager component as default export