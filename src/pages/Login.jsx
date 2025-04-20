import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

// Variantes para animaciones
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Inicio de sesión exitoso');
      navigate('/');
    } catch (error) {
      toast.error('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center py-8 px-4">
      <motion.div
        className="bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Mensaje de Bienvenida */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">Bienvenido</h1>
          <p className="text-gray-300 text-lg">Aplicación para comparar precios</p>
        </div>

        {/* Formulario de Login */}
        <h2 className="text-2xl font-bold text-white text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <motion.button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Iniciar Sesión
          </motion.button>
        </form>

        {/* Enlace a Registro */}
        <p className="text-gray-300 text-center mt-4">
          ¿No tienes una cuenta?{' '}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Regístrate
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;