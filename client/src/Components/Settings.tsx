import {} from 'react'
import { useNavigate } from 'react-router-dom'

function Settings() {
    const navigate = useNavigate();
    const handleLogOut = async () => {
      try {
        const response = await fetch('http://localhost:3000/logout', {
          method: 'DELETE'
        });
    
        if (response.ok) {
          const data = await response.json()
          console.log(data.message); // Log the success message from the server
          navigate('/'); // Redirect using useNavigate
        } else {
          const errorData = await response.json(); // Parse JSON error response
          console.error('Logout error:', errorData.message);
          // Optionally display an error message to the user
        }
      } catch (error) {
        console.error('Error during logout:', error);
        // Optionally display a generic error message to the user
      }
    };

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className='flex gap-4 items-center  mb-6'>
            <button onClick={() => navigate(-1)}>Back</button>
            <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 w-2/4 mx-auto">
            <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Account Settings</h2>
            <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Enable Two-Factor Authentication
                </label>
                <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Receive Email Notifications
                </label>
            </div>
            </div>

            <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Privacy Settings</h2>
            <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Make Profile Private
                </label>
                <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Allow Search Engines to Index My Profile
                </label>
            </div>
            </div>

            <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Notification Settings</h2>
            <div className="flex flex-col space-y-2">
                <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Push Notifications
                </label>
                <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                SMS Notifications
                </label>
            </div>
            </div>

            <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Language Settings</h2>
            <select className="border border-gray-300 rounded-md p-2">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
            </select>
            </div>

        <div className="mt-6">
          <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" onClick={handleLogOut}>
            Logout
          </button>
        </div>
      </div>
    </div>
    </>
  )
}

export default Settings
