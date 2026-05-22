import { useState } from "react";
import type { User, Role } from "../../lib/api";
import { toast } from "sonner";



type AssignRoleModalProps = {
  user: User;
  roles: Role[];
  onAssign: (userId: string, roleId: string) => Promise<void>;
  onClose: () => void;
};

export default function AssignRoleModal({
  user,
  roles,
  onAssign,
  onClose,
}: AssignRoleModalProps) {

  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedRole) return;

    try {
      setLoading(true);
      await onAssign(user.id, selectedRole);
      toast.success("Role assigned");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

        <h2 className="text-lg font-bold mb-4">
          Assign Role
        </h2>

        {/* User Info */}
        <p className="text-sm text-gray-500 mb-3">{user.email}</p>

        {/* Select */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
        >
          <option value="">Select role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="w-full border py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            disabled={!selectedRole || loading}
            onClick={handleAssign}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}