"use client";
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { SectionCard, FormField, Input } from '@/components/ui/FormField';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600 mb-10">Manage your account, security and API access.</p>
        <div className="space-y-0">
          <SectionCard
            title="Personal Info"
            subtitle="Basic details for your account"
            action={<span className="text-xs text-gray-500">User ID: {user?.uid?.slice(0,8)}</span>}
          >
            <form className="space-y-6" onSubmit={(e)=>e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Name" id="displayName">
                  <Input id="displayName" name="displayName" placeholder="Jane Doe" defaultValue={user?.displayName || ''} />
                </FormField>
                <FormField label="Company" id="company">
                  <Input id="company" name="company" placeholder="Acme Corp" defaultValue="" />
                </FormField>
                <FormField label="Email" id="email" hint="Email managed via auth provider." >
                  <Input id="email" name="email" type="email" defaultValue={user?.email || ''} readOnly className="bg-gray-50 text-gray-700" />
                </FormField>
                <FormField label="Website" id="website">
                  <Input id="website" name="website" placeholder="https://" defaultValue="" />
                </FormField>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="px-5 py-2 bg-orange-600 text-white text-sm font-medium">Save Changes</button>
                <span className="text-sm text-gray-500 self-center">(Placeholder only)</span>
              </div>
            </form>
          </SectionCard>

          <SectionCard
            title="API Keys"
            subtitle="Programmatic access to the platform"
            action={<button className="px-4 py-2 bg-orange-600 text-white text-sm" type="button">Generate New Key</button>}
          >
            <div className="-mx-6 -mt-6 mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left">
                    <th className="px-6 py-2 font-medium">Key</th>
                    <th className="px-6 py-2 font-medium">Created</th>
                    <th className="px-6 py-2 font-medium">Last Used</th>
                    <th className="px-6 py-2 font-medium">Status</th>
                    <th className="px-6 py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {[1,2].map(i => (
                    <tr key={i} className="border-b border-gray-200">
                      <td className="px-6 py-2 font-mono">sk_live_xxxx{i}</td>
                      <td className="px-6 py-2 text-gray-600">2025-09-01</td>
                      <td className="px-6 py-2 text-gray-600">2025-09-17</td>
                      <td className="px-6 py-2"><span className="text-green-600">active</span></td>
                      <td className="px-6 py-2 text-right">
                        <button className="text-orange-600 text-xs">Revoke</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">Keys are shown truncated. Store the full value securely when you create a new one.</div>
            </div>
          </SectionCard>

          <SectionCard
            title="Security"
            subtitle="Password & connected accounts"
          >
            <form className="space-y-4 max-w-md" onSubmit={(e)=>e.preventDefault()}>
              <FormField label="Current Password" id="currentPassword">
                <Input id="currentPassword" type="password" />
              </FormField>
              <FormField label="New Password" id="newPassword">
                <Input id="newPassword" type="password" />
              </FormField>
              <FormField label="Confirm Password" id="confirmPassword">
                <Input id="confirmPassword" type="password" />
              </FormField>
              <div className="flex gap-4">
                <button type="submit" className="px-5 py-2 bg-orange-600 text-white text-sm font-medium">Update Password</button>
                <span className="text-sm text-gray-500 self-center">(Placeholder)</span>
              </div>
            </form>
            <div className="border-t border-gray-200 pt-6 max-w-md">
              <h3 className="text-lg font-medium mb-2">Connected Accounts</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Google</p>
                  <p className="text-xs text-gray-500">{user?.providerData?.some(p=>p.providerId==='google.com') ? 'Linked' : 'Not linked'}</p>
                </div>
                {user?.providerData?.some(p=>p.providerId==='google.com') ? (
                  <button className="px-4 py-2 border border-gray-300 text-sm" type="button">Unlink</button>
                ) : (
                  <Link href="/signin" className="px-4 py-2 bg-orange-600 text-white text-sm">Link Google</Link>
                )}
              </div>
            </div>
          </SectionCard>
        </div>
      </main>
    </ProtectedRoute>
  );
}
