import React from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import { GoogleUser } from '../types';

interface AuthButtonProps {
  user: GoogleUser | null;
  onSignIn: () => void;
  onSignOut: () => void;
  loading: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({ user, onSignIn, onSignOut, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
        <span className="text-gray-600">Carregando...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
          {user.picture ? (
            <img 
              src={user.picture} 
              alt={user.name}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User size={16} className="text-green-600" />
          )}
          <span className="text-green-700 font-medium text-sm">{user.name}</span>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onSignIn}
      className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
    >
      <LogIn size={20} />
      <span className="font-medium">Entrar com Google</span>
    </button>
  );
};

export default AuthButton;