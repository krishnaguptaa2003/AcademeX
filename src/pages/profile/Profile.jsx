import { useForm } from 'react-hook-form';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

function Profile() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: user?.email || '',
      fullName: user?.username || '',
    },
  });

  const onSubmit = (data) => {
    // TODO: call backend /api/profile/update
    console.log('Profile update', data);
    addToast('Profile updated (demo only). Hook to backend later.', 'success');
    reset(data);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your account information and preferences.
      </p>

      <div className="mt-6">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email (read-only for now) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                disabled
                {...register('email')}
                className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-400">
                Email change is not available in this demo.
              </p>
            </div>

            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                type="text"
                {...register('fullName', { required: 'Name is required' })}
                className={`mt-1 block w-full rounded-md border ${
                  errors.fullName ? 'border-red-300' : 'border-gray-300'
                } px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-primary`}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Role badge */}
            {user?.role && (
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {user.role}
                </span>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Profile;
