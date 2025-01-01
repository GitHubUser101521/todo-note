import { useFormik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import * as yup from 'yup';
import { useAccountStore } from '../AccountStore';

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
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
            'Password must contain at least one uppercase, lowercase, number and special character')
});

type SignupFormData = yup.InferType<typeof signupValidationSchema>;

function Signup() {
    const navigate = useNavigate()
    const { setAccountInfos } = useAccountStore()
    const formik = useFormik<SignupFormData>({
        initialValues: {
            name: '',
            password: '',
        },
        validateOnChange: true,
        validationSchema: signupValidationSchema,
        onSubmit: async (values) => {
            try {
                const response = await fetch('http://localhost:3000/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });

                const data = await response.json()

                if (!response.ok) {
                    console.error("Error creating user:", data.message);
                    alert(data.message)
                } else {
                    setAccountInfos(data)
                    navigate('/todolist')
                    formik.resetForm()
                }
            } catch (error) {
                console.error('Error:', error);
                alert("an error has occured")
            }
        },
    });

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
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
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
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
                    <button type="submit" className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200 mb-2">Sign Up</button>
                    <p>Already have an account? <Link to="/login" className='underline text-blue-800'>Login</Link></p>
                </form>
            </div>
        </div>
    );
}

export default Signup;