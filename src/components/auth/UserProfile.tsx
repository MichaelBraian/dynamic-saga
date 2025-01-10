import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export function UserProfile() {
  const { user, signOut, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  if (!user) {
    return null;
  }

  const createdAt = user.created_at ? new Date(user.created_at) : new Date();
  const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at) : new Date();

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
            {user.email?.[0]?.toUpperCase() || '?'}
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{user.email}</h2>
          <p className="text-sm text-gray-500">
            Member since {createdAt.toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-4">
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Account Details
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <span className="ml-2 text-sm text-gray-900">{user.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Email verified:
                </span>
                <span className="ml-2 text-sm text-gray-900">
                  {user.email_confirmed_at ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Last sign in:
                </span>
                <span className="ml-2 text-sm text-gray-900">
                  {lastSignIn.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 