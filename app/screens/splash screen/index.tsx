


// const SignUpScreen = ({ setCurrentScreen }) => {
//     const [message, setMessage] = useState('');
//     return (
//         <AuthScreenContainer>
//             <CustomMessageBox message={message} type="success" onClose={() => setMessage('')} />
//             <h1 className="text-white text-3xl font-bold mb-2">Register</h1>
//             <p className="text-gray-400 text-base mb-8">Create your account.</p>

//             <input className="w-full p-4 rounded-xl text-white bg-gray-700 placeholder-gray-400 mb-4" placeholder="Full Name" />
//             <input className="w-full p-4 rounded-xl text-white bg-gray-700 placeholder-gray-400 mb-4" placeholder="Country" />
//             <input className="w-full p-4 rounded-xl text-white bg-gray-700 placeholder-gray-400 mb-4" placeholder="Email" type="email" />
//             <input className="w-full p-4 rounded-xl text-white bg-gray-700 placeholder-gray-400 mb-8" placeholder="Password (min 6 chars)" type="password" />

//             <button className="w-full p-4 rounded-xl bg-violet-600 text-white font-bold text-lg hover:bg-violet-700 transition shadow-lg shadow-violet-500/30" onClick={() => {
//                 setMessage('Registration simulated! Redirecting to Sign In...');
//                 setTimeout(() => { setCurrentScreen('SignIn'); }, 1500);
//             }}>
//                 Register
//             </button>
//             <div className="mt-6 text-center">
//                 <button className="text-gray-400 text-sm hover:text-white transition" onClick={() => setCurrentScreen('SignIn')}>
//                     Already have an account? <span className="text-cyan-400 font-semibold">Sign In</span>
//                 </button>
//             </div>
//         </AuthScreenContainer>
//     );
// };