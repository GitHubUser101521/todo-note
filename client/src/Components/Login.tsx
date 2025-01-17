import {} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom'
import { useAccountStore } from '../Utils/AccountStore';

const signupValidationSchema = yup.object().shape({
    name: yup.string()
        .required('Name is required')
        .min(3, "Name must be at least 3 characters")
        .max(15, "Name must be less than 15 characters")
        .matches(/^[a-zA-Z0-9]*$/, 'Name must contain only uppercase, lowercase letters, and numbers'),
    password: yup.string()
        .required('Password is required')
        .min(8, "Password must be at least 8 characters")
        .max(15, "Password must be less than 15 characters")
});

type SignupFormData = yup.InferType<typeof signupValidationSchema>;

function Login() {
    const { setAccountInfos } = useAccountStore()
    const navigate = useNavigate()

    const formik = useFormik<SignupFormData>({
        initialValues: {
            name: '',
            password: '',
        },
        validateOnChange: true,
        validationSchema: signupValidationSchema,
        onSubmit: async (values) => {
            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(`Incorrect name or password: ${data.message}`);
                } else {
                    navigate('/todolist')
                    formik.resetForm();
                    setAccountInfos(data)
                }
            } catch (error) {
                console.error('Error:', error);
                alert("An error has occurred");
            }
        },
    });

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label> 
                        <input
                            type="text"
                            id="name"
                            name="name"
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur}     
                            value={formik.values.name}     
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter your name"
                        />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="text-red-500 text-sm">{formik.errors.name}</div>
                        ) : null}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={formik.handleChange} 
                            onBlur={formik.handleBlur}    
                            value={formik.values.password}    
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                        {formik.touched.password && formik.errors.password ? (
                            <div className="text-red-500 text-sm">{formik.errors.password}</div>
                        ) : null}
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200 mb-2">Log In</button> 
                    <p>Don't have an account? <Link to="/signup" className='underline text-blue-800'>Signup</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Login;